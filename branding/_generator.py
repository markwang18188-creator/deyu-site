"""
DEYU brand assets — v2: trimmed logo, horizontal banner layout, ASCII-safe glyphs.
"""
import os
from PIL import Image, ImageDraw, ImageFont

LOGO_PATH = "/Volumes/Download/deyusolemachine网站项目/网站用图片/logo11.png"
OUT_DIR = "/tmp/branding"
os.makedirs(OUT_DIR, exist_ok=True)

# Brand colors
BLUE      = (30, 58, 138)
BLUE_DARK = (15, 23, 42)
ORANGE    = (234, 88, 12)
WHITE     = (255, 255, 255)
GRAY_LT   = (203, 213, 225)
GRAY_DIVIDER = (60, 90, 170)

# Fonts
F_BOLD  = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
F_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
F_REG   = "/System/Library/Fonts/Supplemental/Arial.ttf"


def load_logo_trimmed() -> Image.Image:
    """Load logo and crop to its content bounding box (drop transparent margins)."""
    logo = Image.open(LOGO_PATH).convert("RGBA")
    # Composite on white to find content via alpha bbox
    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)
    return logo


def vertical_gradient(size, top_color, bottom_color) -> Image.Image:
    w, h = size
    top = Image.new("RGB", size, top_color)
    bottom = Image.new("RGB", size, bottom_color)
    mask = Image.new("L", (1, h))
    for y in range(h):
        mask.putpixel((0, y), int(255 * y / h))
    mask = mask.resize(size)
    return Image.composite(bottom, top, mask)


# ─────────────────────────────────────────────────────────────
# 1) YouTube Avatar — 800x800, stacked DY mark + DEYU text
#    (circular crop friendly: square-ish content, centered)
# ─────────────────────────────────────────────────────────────
def load_dy_mark() -> Image.Image:
    """Crop just the DY symbol from the source logo."""
    logo = Image.open(LOGO_PATH).convert("RGBA")
    trimmed = logo.crop(logo.getbbox())  # 795x264
    # The DY mark is the leftmost ~260px
    mark = trimmed.crop((0, 0, 260, 264))
    return mark.crop(mark.getbbox())

LOGO_BLUE = (33, 92, 165)  # color sampled from the DY mark

def make_youtube_avatar():
    canvas = Image.new("RGB", (800, 800), WHITE)
    draw = ImageDraw.Draw(canvas)

    dy = load_dy_mark()
    # Scale DY mark to ~340px tall (will sit in upper portion of circle)
    mark_h = 360
    scale = mark_h / dy.height
    mark_w = int(dy.width * scale)
    dy_scaled = dy.resize((mark_w, mark_h), Image.LANCZOS)

    # Stack: DY mark on top, DEYU text below
    font_deyu = ImageFont.truetype(F_BLACK, 110)
    text = "DEYU"
    text_bbox = draw.textbbox((0, 0), text, font=font_deyu)
    text_w = text_bbox[2] - text_bbox[0]
    text_h = text_bbox[3] - text_bbox[1]

    gap = 24
    total_h = mark_h + gap + text_h
    start_y = (800 - total_h) // 2 - 10  # nudge up slightly

    # Center DY mark horizontally
    mark_x = (800 - mark_w) // 2
    canvas.paste(dy_scaled, (mark_x, start_y), dy_scaled)

    # Center DEYU text
    text_x = (800 - text_w) // 2
    text_y = start_y + mark_h + gap
    draw.text((text_x, text_y - text_bbox[1]), text, fill=LOGO_BLUE, font=font_deyu)

    canvas.save(f"{OUT_DIR}/youtube-avatar.png", "PNG", optimize=True)
    print(f"OK youtube-avatar.png ({canvas.size})  DY mark: {dy.size}")


# ─────────────────────────────────────────────────────────────
# 2) YouTube Banner — 2560x1440, all-device safe zone 1546x423
# ─────────────────────────────────────────────────────────────
def make_youtube_banner():
    W, H = 2560, 1440
    SAFE_W, SAFE_H = 1546, 423
    SAFE_X = (W - SAFE_W) // 2
    SAFE_Y = (H - SAFE_H) // 2

    canvas = vertical_gradient((W, H), BLUE, BLUE_DARK)
    draw = ImageDraw.Draw(canvas)

    # Bottom orange accent
    draw.rectangle([(0, H - 14), (W, H)], fill=ORANGE)

    # Decorative geometric shapes on far left/right (outside safe zone)
    # Soft diagonal lines, very subtle
    for i in range(40):
        x_off = 60 + i * 18
        draw.line([(W - x_off, 0), (W - x_off - 200, H)], fill=(40, 65, 145), width=1)
        draw.line([(x_off, H), (x_off + 200, 0)], fill=(40, 65, 145), width=1)

    # ── Content inside safe zone ──
    # Horizontal split: logo pill on left, text on right
    logo = load_logo_trimmed()

    # Sizes that all fit within 423px height
    pill_inner_h = 240
    pill_pad = 28
    pill_w_inner = int(logo.width * (pill_inner_h / logo.height))
    pill_w = pill_w_inner + pill_pad * 2
    pill_h = pill_inner_h + pill_pad * 2  # = 296

    # Vertically center the pill inside safe zone
    pill_x = SAFE_X + 20
    pill_y = SAFE_Y + (SAFE_H - pill_h) // 2

    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=24,
        fill=WHITE,
    )
    logo_scaled = logo.resize((pill_w_inner, pill_inner_h), Image.LANCZOS)
    canvas.paste(logo_scaled, (pill_x + pill_pad, pill_y + pill_pad), logo_scaled)

    # Vertical divider line right of pill
    div_x = pill_x + pill_w + 60
    draw.line([(div_x, SAFE_Y + 40), (div_x, SAFE_Y + SAFE_H - 40)], fill=GRAY_DIVIDER, width=3)

    # Text block right of divider — vertically centered
    text_x = div_x + 60
    text_w = SAFE_X + SAFE_W - text_x

    font_main  = ImageFont.truetype(F_BLACK, 84)
    font_sub   = ImageFont.truetype(F_BOLD, 48)
    font_small = ImageFont.truetype(F_REG, 38)

    main_text = "Shoe Sole Injection\nMoulding Machines"
    sub_text  = "Wenzhou, China  ·  Exported to 30+ Countries"
    small_text = "ISO 9001 & CE Certified   |   15+ Years Manufacturing"

    # Measure stack height
    main_lines = main_text.split("\n")
    main_line_h = 96
    main_h = main_line_h * len(main_lines)
    gap1 = 22
    sub_h = 56
    gap2 = 14
    small_h = 42
    total_h = main_h + gap1 + sub_h + gap2 + small_h

    start_y = SAFE_Y + (SAFE_H - total_h) // 2

    for i, line in enumerate(main_lines):
        draw.text((text_x, start_y + i * main_line_h), line, fill=ORANGE, font=font_main)

    draw.text(
        (text_x, start_y + main_h + gap1),
        sub_text,
        fill=WHITE,
        font=font_sub,
    )
    draw.text(
        (text_x, start_y + main_h + gap1 + sub_h + gap2),
        small_text,
        fill=GRAY_LT,
        font=font_small,
    )

    canvas.save(f"{OUT_DIR}/youtube-banner.png", "PNG", optimize=True)
    print(f"OK youtube-banner.png ({canvas.size})")


# ─────────────────────────────────────────────────────────────
# 3) Facebook Cover — 1640x624
# ─────────────────────────────────────────────────────────────
def make_facebook_cover():
    W, H = 1640, 624
    canvas = vertical_gradient((W, H), BLUE, BLUE_DARK)
    draw = ImageDraw.Draw(canvas)

    draw.rectangle([(0, H - 10), (W, H)], fill=ORANGE)

    # Subtle decoration on right
    for i in range(20):
        x_off = 60 + i * 22
        draw.line([(W - x_off, 0), (W - x_off - 120, H)], fill=(40, 65, 145), width=1)

    logo = load_logo_trimmed()

    pill_inner_h = 150
    pill_pad = 22
    pill_w_inner = int(logo.width * (pill_inner_h / logo.height))
    pill_w = pill_w_inner + pill_pad * 2
    pill_h = pill_inner_h + pill_pad * 2

    pill_x = 70
    pill_y = (H - pill_h) // 2

    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=18,
        fill=WHITE,
    )
    logo_scaled = logo.resize((pill_w_inner, pill_inner_h), Image.LANCZOS)
    canvas.paste(logo_scaled, (pill_x + pill_pad, pill_y + pill_pad), logo_scaled)

    div_x = pill_x + pill_w + 40
    draw.line([(div_x, pill_y), (div_x, pill_y + pill_h)], fill=GRAY_DIVIDER, width=2)

    text_x = div_x + 40

    font_main  = ImageFont.truetype(F_BLACK, 52)
    font_sub   = ImageFont.truetype(F_BOLD, 30)
    font_small = ImageFont.truetype(F_REG, 22)

    main_line_h = 62
    main_lines = ["Shoe Sole Injection", "Moulding Machines"]
    main_h = main_line_h * len(main_lines)
    gap1 = 14
    sub_h = 36
    gap2 = 8
    small_h = 26
    total_h = main_h + gap1 + sub_h + gap2 + small_h

    start_y = (H - total_h) // 2
    for i, line in enumerate(main_lines):
        draw.text((text_x, start_y + i * main_line_h), line, fill=ORANGE, font=font_main)
    draw.text((text_x, start_y + main_h + gap1), "Wenzhou, China  ·  Exported to 30+ Countries", fill=WHITE, font=font_sub)
    draw.text((text_x, start_y + main_h + gap1 + sub_h + gap2), "ISO 9001 & CE Certified  |  15+ Years Manufacturing  |  deyusolemachine.com", fill=GRAY_LT, font=font_small)

    canvas.save(f"{OUT_DIR}/facebook-cover.png", "PNG", optimize=True)
    print(f"OK facebook-cover.png ({canvas.size})")


if __name__ == "__main__":
    make_youtube_avatar()
    make_youtube_banner()
    make_facebook_cover()
    print(f"\nAll saved to: {OUT_DIR}/")
