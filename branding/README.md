# Branding Assets

Generated brand visuals for social media platforms.

## Files

| File | Use | Dimensions |
|---|---|---|
| `youtube-avatar.png` | YouTube channel avatar + Facebook profile pic | 800×800 |
| `youtube-banner.png` | YouTube channel banner | 2560×1440 (all-device safe zone 1546×423) |
| `facebook-cover.png` | Facebook Page cover photo | 1640×624 (retina 2x of 820×312) |

## Regenerate

```bash
python3 branding/_generator.py
```

Edit colors / text / fonts in `_generator.py`, re-run, the 3 PNGs regenerate from `logo11.png` source.

## Source logo

The Python script reads from `/Volumes/Download/deyusolemachine网站项目/网站用图片/logo11.png` (Mark's NAS). If logo file moves, update `LOGO_PATH` constant in the generator.
