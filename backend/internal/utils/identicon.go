package utils

import (
	"crypto/md5"
	"fmt"
	"io"
)

// GenerateIdenticon generates an SVG string based on the seed string.
// Use consistent hashing to determine color and pattern.
func GenerateIdenticon(seed string) string {
	// 1. Hash the seed
	h := md5.New()
	io.WriteString(h, seed)
	hash := h.Sum(nil)

	// 2. Determine Color (HSL-like but simple RGB from hash)
	// Use first 3 bytes for color, but ensure it's not too dark or too light for visibility
	r := int(hash[0])
	g := int(hash[1])
	b := int(hash[2])

	// Boost saturation/brightness if needed (simple approach: make sure at least one channel is high)
	if r < 100 && g < 100 && b < 100 {
		r += 100
		g += 50
	}

	color := fmt.Sprintf("rgb(%d,%d,%d)", r, g, b)

	// 3. Generate Pattern (5x5 grid, symmetric)
	// We need 15 bits for the left 3 columns (5 rows * 3 cols).
	// We can use bytes 3, 4 needed? 15 bits fits in 2 bytes.
	// hash[3], hash[4]

	// SVG Header
	svg := fmt.Sprintf(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 5 5" style="background-color: #f0f0f0; border-radius: 50%%;">`)

	// Draw active cells
	// Grid 5x5
	// [0,0] [1,0] [2,0] [3,0] [4,0]
	// ...

	// We iterate cols 0..2 (left half), rows 0..4
	// If bit is 1, draw cell at (c, r) and (4-c, r)

	rects := ""
	idx := 0
	for c := 0; c < 3; c++ {
		for r := 0; r < 5; r++ {
			// Get byte index and bit index
			byteIdx := 3 + (idx / 8)
			bitIdx := idx % 8

			// Check if bit is set
			if byteIdx < len(hash) && (hash[byteIdx]&(1<<bitIdx)) != 0 {
				// Draw Circle (as requested "shapes (circles)")
				// Using cx, cy, r=0.4 (since box is 1x1)
				// Left side
				rects += fmt.Sprintf(`<circle cx="%0.1f" cy="%0.1f" r="0.4" fill="%s" />`, float64(c)+0.5, float64(r)+0.5, color)

				// Mirror right side (if not center column)
				if c < 2 {
					rects += fmt.Sprintf(`<circle cx="%0.1f" cy="%0.1f" r="0.4" fill="%s" />`, float64(4-c)+0.5, float64(r)+0.5, color)
				}
			}
			idx++
		}
	}

	svg += rects + "</svg>"
	return svg
}
