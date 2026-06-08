
PROMPT 1 — Intern Document Upload Portal (Client Side)
Design a document submission portal for Reagvis Labs interns called 
"Reagvis Intern Portal". The entire UI should feel like an extension 
of the Reagvis careers site.

COLOR SYSTEM:
- Page background: linear-gradient(155deg, #FFEBD4, #FFCF99, #FFB868, #FFA84A)
- Radial overlay top-right: rgba(249,115,22, 0.09) ellipse
- Radial overlay bottom-left: rgba(232,80,58, 0.06) ellipse
- Diagonal texture: rgba(255,255,255, 0.06) repeating stripes at -45deg
- Card surfaces: rgba(255,255,255, 0.88) with rgba(249,115,22, 0.18) border
- CTA button: linear-gradient(135deg, #E8503A, #F97316)
- Accent: #F97316, dark accent: #C2410C
- Text primary: #1C0A00, text secondary: rgba(139,45,5, 0.85)
- Frosted glass elements: rgba(255,255,255, 0.35) backdrop-blur

OVERALL LAYOUT:
The main container should be shaped exactly like a physical document 
folder — the classic folder tab shape where the top-left corner has 
a raised rectangular tab (like a manila folder). This folder shape 
is the hero UI element. It should feel like interns are literally 
dropping files into a folder. The folder shape should have:
- Top-left tab: 120px wide, 28px tall, same warm orange gradient, 
  with "MY DOCUMENTS" label in small caps
- Main folder body: large card, min 680px wide, rounded corners 
  bottom and bottom-right, sharp on top-left where tab meets body
- Folder border: rgba(249,115,22, 0.25), subtle shadow mixing 
  rgba(249,115,22, 0.12) and rgba(0,0,0,0.08)
- Ambient pulsing ring: rgba(255,255,255, 0.08) border, 420px circle 
  behind the folder, slow pulse animation

HEADER (above folder):
- Reagvis Labs logo top-left (use placeholder)
- Tagline: "Submit your onboarding documents" in warm dark text
- Small pill badge: "Secure Submission" with lock SVG icon, 
  background rgba(255,255,255,0.35), border rgba(200,80,10,0.18), 
  dot #C2410C
- Geometric decoration: 3 hexagon outlines in #F97316 stroke, 
  scattered top-right corner, opacity 0.15

INSIDE THE FOLDER CARD:
Step indicator at top — horizontal stepper with 3 steps:
  Step 1: "Your Details"
  Step 2: "Upload Documents" 
  Step 3: "Confirm & Submit"
  Active step connector: linear-gradient(90deg, #F97316, #FB923C)
  Inactive: #E5E7EB
  Step circles: 32px, active filled #E8503A, completed checkmark, 
  inactive outlined

STEP 1 — Your Details:
  Two fields side by side:
  - Full Name (text input)
  - Email Address (text input)
  One full-width field:
  - Intern ID / Roll Number
  Field style: white background, 1px solid #E5E7EB border, 
  8px radius, focus ring rgba(249,115,22, 0.4)
  "Continue" button: full width, linear-gradient(135deg, #E8503A, #F97316),
  white text, 12px radius, subtle orange glow shadow

STEP 2 — Upload Documents (main step, show this as hero state):
  4 document upload slots, each as individual mini-cards:
  
  Card 1: Government ID
  Card 2: 10th Marksheet  
  Card 3: 12th Marksheet
  Card 4: Latest Semester Marksheet
  
  Each upload card:
  - 160px tall, full width
  - Background: rgba(255,255,255, 0.6)
  - Border: 1.5px dashed rgba(249,115,22, 0.35)
  - Border-radius: 10px
  - Left side: document type icon (SVG line icon, #F97316 color, 
    32px), document name in semibold, small hint text 
    "PDF or JPG, max 5MB" in muted color
  - Right side: "Choose File" pill button, 
    background rgba(249,115,22,0.1), border rgba(249,115,22,0.3), 
    text #C2410C
  - Uploaded state: replace dashed border with solid 
    rgba(34,197,94,0.4), show filename + green checkmark, 
    small "Remove" link in muted red
  - Hover state: background rgba(255,255,255,0.9), border 
    rgba(249,115,22,0.6), subtle lift shadow

  Below cards: 
  Progress bar showing "X of 4 documents uploaded"
  Bar fill: linear-gradient(90deg, #F97316, #FB923C)
  
  "Submit Documents" CTA button:
  - Full width, 52px tall
  - linear-gradient(135deg, #E8503A, #F97316)
  - White bold text "Submit Documents →"
  - Box shadow: 0 8px 24px rgba(249,115,22,0.35)
  - Disabled state when not all 4 uploaded: opacity 0.5, 
    no shadow, cursor not-allowed

STEP 3 — Confirmation:
  Centered success state inside folder:
  - Large animated checkmark circle: #F97316 ring, white check
  - Heading: "Documents Submitted!"
  - Subtext: "We'll verify and get back to you within 24 hours"
  - Summary list of all 4 uploaded files with green check each
  - Small pill: "Submission ID: #RGL-XXXX" in frosted glass style

FOOTER (inside folder, bottom):
  "Need help? Contact onboarding@reagvislabs.com"
  Small lock icon + "256-bit encrypted submission"
  Both in rgba(139,45,5,0.6) muted text

GEOMETRIC DECORATIONS:
  - Bottom-right of page: large hexagon outline, #F97316 stroke, 
    opacity 0.08, 200px
  - Scattered dot grid pattern behind folder, 
    rgba(249,115,22,0.08), 16px spacing
  - Small floating orange dots (3-4), various opacities 0.1-0.2

TYPOGRAPHY:
  Font: Inter
  Heading: 28px, weight 700, #1C0A00
  Subheading: 16px, weight 600, rgba(139,45,5,0.85)
  Body: 14px, weight 400, #374151
  Hint: 12px, weight 400, #9CA3AF
  Step labels: 11px, weight 600, uppercase, letter-spacing 0.05em

OVERALL FEEL:
Warm, trustworthy, premium but approachable. Should feel like a 
natural extension of reagvislabs.com careers page. Clean and 
minimal inside the folder, rich and textured outside.

PROMPT 2 — Admin Document Dashboard
Design an internal admin dashboard for Reagvis Labs called 
"Reagvis DocPanel" for reviewing intern document submissions. 
This is an internal tool — slightly more dense with information 
than the intern portal, but same design language.

COLOR SYSTEM:
- Sidebar background: linear-gradient(180deg, #1C0A00, #2D1200)
- Main content background: #FDF8F3 (warm off-white)
- Card surfaces: #FFFFFF with rgba(249,115,22,0.08) border
- Accent: #F97316, dark: #C2410C, deeper: #E8503A
- CTA: linear-gradient(135deg, #E8503A, #F97316)
- Status green: #16A34A, status red: #DC2626, 
  status yellow: #D97706
- Text primary: #1C0A00, text secondary: #6B7280
- Table row hover: rgba(249,115,22,0.04)
- Active sidebar item: rgba(249,115,22,0.15) background, 
  #F97316 left border 3px

LAYOUT — 3 column structure:
Left: 240px fixed sidebar
Center: flexible main content area
Right: 320px detail panel (slides in when intern selected)

LEFT SIDEBAR:
- Top: Reagvis Labs logo + "DocPanel" label in small orange pill
- Nav items with SVG line icons:
  • Dashboard (home icon)
  • All Submissions (folder icon) ← active state shown
  • Pending Review (clock icon) with badge count "3"
  • Verified (checkmark icon)
  • Rejected (x-circle icon)
  • Settings (gear icon) pushed to bottom
- Each nav item: 44px tall, 12px horizontal padding, 
  14px Inter medium
- Active: rgba(249,115,22,0.15) bg, 3px #F97316 left border, 
  #F97316 icon + text
- Inactive: rgba(255,255,255,0.5) icon + text
- Bottom of sidebar: admin avatar + name + "Reagvis Admin" role label

TOP HEADER BAR:
- "All Submissions" page title, 22px bold
- Breadcrumb: DocPanel > Submissions
- Right side: search bar (rounded, 280px wide, 
  placeholder "Search by name or ID...")
- Filter pills row below: 
  "All" | "Pending" | "Verified" | "Rejected"
  Active pill: #E8503A background, white text
  Inactive: white bg, #E5E7EB border
- Export button: outlined, #F97316 border + text, 
  download icon, "Export CSV"

STATS ROW (4 cards below header):
  Card 1: Total Submissions — large number, #1C0A00
  Card 2: Pending Review — number in #D97706
  Card 3: Verified — number in #16A34A  
  Card 4: Rejected — number in #DC2626
  
  Each stat card:
  - White bg, rgba(249,115,22,0.1) border
  - 8px radius, 20px padding
  - Small label above, big number below
  - Tiny trend arrow (up/down) with percentage

MAIN SUBMISSIONS TABLE:
  Columns:
  | # | Intern Name | Intern ID | Submitted | Documents | Status | Actions |
  
  Header row: #FDF8F3 bg, 11px uppercase labels, 
  #9CA3AF color, letter-spacing 0.08em
  
  Each data row:
  - 56px tall
  - Intern name: 15px semibold + email below in 12px muted
  - Intern ID: monospace font, #F97316 color, 
    like a badge rgba(249,115,22,0.1) bg
  - Submitted: relative time "2 hours ago" style
  - Documents column: 4 mini document pills in a row
    Each pill shows doc type abbreviated: 
    "GOV ID" | "10th" | "12th" | "SEM"
    Uploaded = rgba(34,197,94,0.15) bg + #16A34A text
    Missing = rgba(229,231,235,0.8) bg + #9CA3AF text
  - Status badge:
    Pending: rgba(217,119,6,0.12) bg, #D97706 text, 
    clock icon, "Pending"
    Verified: rgba(22,163,74,0.12) bg, #16A34A text, 
    check icon, "Verified"
    Rejected: rgba(220,38,38,0.12) bg, #DC2626 text, 
    x icon, "Rejected"
  - Actions: "Review →" text button in #F97316, 
    and kebab menu (3 dots)
  - Row hover: rgba(249,115,22,0.04) background
  - Selected row: rgba(249,115,22,0.08) bg, 
    #F97316 left border 3px

RIGHT DETAIL PANEL (shown when row selected):
  Slides in from right, 320px width
  Top section:
  - Intern avatar (initials based, orange gradient circle)
  - Full name 18px bold
  - Intern ID pill
  - Submitted timestamp
  - Current status badge
  
  Document checklist section:
  - Heading "Submitted Documents"
  - 4 rows, one per document:
    Each row: doc icon + doc type name + 
    "View" link + "Download" icon
    Uploaded docs: solid row
    Missing: greyed out with "Not uploaded" label
  
  Action buttons:
  - "Verify All" — full width, 
    linear-gradient(135deg, #E8503A, #F97316), white text
  - "Request Resubmission" — full width, outlined, 
    #F97316 border, #F97316 text
  - "Reject" — full width, outlined, 
    #DC2626 border, #DC2626 text
  
  Notes section:
  - "Add a note" textarea, 80px tall, 
    placeholder "Internal notes..."
  - "Save Note" small button

EMPTY STATE (when no submissions):
  Centered in main content area:
  Large folder SVG illustration in #F97316 tones, 
  "No submissions yet" heading, 
  subtext "Intern submissions will appear here"

TYPOGRAPHY:
  Font: Inter throughout
  Page title: 22px, 700
  Table header: 11px, 600, uppercase, #9CA3AF
  Table body: 14px, 400/600
  Stat numbers: 32px, 700
  Badge text: 11px, 600

OVERALL FEEL:
Professional internal tool. Sidebar is dark and grounding, 
content area is warm and light. Orange accents tie it to 
the Reagvis brand. Dense but not cluttered — every element 
has breathing room. Should feel like a premium internal ops 
tool, not a generic admin template.
