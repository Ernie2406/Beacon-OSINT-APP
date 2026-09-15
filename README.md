A web app that helps a user search for publicly available photos connected to a person using OSINT-style search operators.

The app should allow the user to enter any combination of identifiers, including but not limited to:

Name
City
State
Employer
Job title
Hobbies
Marital status
Social media usernames
Known websites
Date ranges
Other relevant keywords
The user should not be required to complete every field. The app should generate useful search queries based only on the information provided.

Core features:

Search operator generator
Generate Google-style search operators using inputs such as name, location, employer, and keywords.
Include operators such as:
site:
filetype:
inurl:
intitle:
before:
after:
exact-match quotes
OR logic
Generate searches for public platforms and sources, including:
LinkedIn
Facebook
Instagram
Flickr
Meetup
Eventbrite
News sites
Company blogs
Government or agency websites
PDFs and archived pages
Reverse image search workflow
Allow the user to upload a reference image.
If the image is blurry, low-resolution, dark, or unclear, optionally enhance it before searching.
Enhancement may include:
Denoising
Sharpening
Brightness and contrast adjustment
Upscaling
Cropping around the face or body
The app should then prepare the enhanced image for use in reverse image search tools such as Google Images, TinEye, Yandex Images, or other public image search engines.
Identification matching system
Compare discovered images against the user-provided identifiers.
Use facial similarity and visible body characteristics as supporting signals where legally and ethically permitted.
Also compare contextual metadata, such as:
Name matches
Location matches
Employer matches
Social profile matches
Captions
Page titles
URLs
Dates
Surrounding text
Do not rely on facial recognition alone.
Confidence grading
For each discovered image, assign a confidence score indicating the likelihood that the image depicts the intended person.
Use a clear grading scale, such as:
High confidence: strong facial/contextual match
Medium confidence: partial match or limited context
Low confidence: weak match or possible name collision
Not enough evidence: insufficient data to determine
Explain why each image received its score.
Results dashboard
Display each discovered image with:
Source URL
Thumbnail or preview if available
Matching search query
Matched identifiers
Confidence grade
Explanation of the match
Date found
Allow the user to export results as CSV, JSON, or PDF.
Privacy and safety requirements:

Search only publicly available information.
Do not bypass logins, paywalls, privacy controls, robots.txt restrictions, or platform terms.
Do not scrape private accounts or restricted content.
Include a disclaimer that results may include false positives and should be manually verified.
Avoid making definitive identity claims without strong supporting evidence.
Provide users with controls to delete uploaded images and search history.
Build the app with a clean, simple interface and modular backend logic so additional search operators, platforms, and image-search tools can be added later.
