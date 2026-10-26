# Bouncie 3D-look sprites

Generated using the built-in image tool from the approved Bouncie concept, then mechanically extracted and packed with scripts/pack-bouncie.cjs (Sharp). The character is a rendered 2D sprite, not a real-time 3D model.

Final asset: assets/bouncie-atlas.webp, transparent RGBA, 1024 × 960, four columns and three rows. Each frame 256 × 320. Foot baseline y=316, transparent padding, display size 88 × 110 world units. Body collision remains 32 × 65, independent of hair or pose.

Frame order, zero-based: 0 idle, 1 blink, 2 alternate idle, 3 happy; 4–7 walking at 10 fps; 8 jump up, 9 falling, 10 landing, 11 hurt. Left movement mirrors the right-facing art; the coil graphic is symbol-only, so there is no text to reverse. Idle decoration is disabled by Reduce motion; necessary gait/jump states remain.

Loading starts with the module and blocks movement until resolved. Image error/12-second timeout leaves the vector fallback and reports it. Pose progression uses game time and freezes while dialogs are open. Walk frames differ in arms and legs, but this is a compact four-pose cycle rather than a skeletal animation rig.

Generation prompt: reference-only character identity; transparent 4-column × 3-row sheet with same brown-ponytail girl, yellow hair tie, turquoise spring T-shirt, yellow shorts and navy/white shoes; full-body consistent scale; idle/blink/happy, four walking phases, ascending/descending jump, crouched landing, surprised reaction; no lettering or backdrop. The source sheet has nonuniform row separators; packing uses inspected rows 0/360/687/1024 and normalizes the output baseline.
