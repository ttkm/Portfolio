# Portfolio Website with Secure Contact Form

A modern, interactive portfolio website featuring a secure contact form with custom CAPTCHA implementation.

## Features

- Responsive design with modern animations
- Interactive particle system and 3D elements
- Secure contact form with:
  - Custom CAPTCHA verification
  - Spam detection
  - Rate limiting
  - Honeypot field
  - Form validation
- Smooth scrolling and section navigation
- Mobile-friendly interface

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Three.js for 3D graphics
- GSAP for animations
- FormSubmit for form handling
- Custom CAPTCHA implementation

## Contact Form Security

The contact form implements several security measures:

1. **Custom CAPTCHA**: Simple math problem that must be solved before submission
2. **Spam Detection**: Filters out messages containing suspicious patterns
3. **Rate Limiting**: Prevents multiple submissions in a short time period
4. **Honeypot Field**: Hidden field to catch automated submissions
5. **Input Validation**: Client-side validation for all form fields

## Setup and Deployment

1. Clone this repository
2. Update the form action URL in `index.html` with your own FormSubmit endpoint
3. Customize the content in `index.html` to match your information
4. Deploy to your preferred hosting service

## Form Configuration

The contact form uses [FormSubmit](https://formsubmit.co/) for processing. To configure it for your use:

1. Replace the email in the form action with your own: `action="https://formsubmit.co/YOUR_EMAIL_HERE"`
2. Customize hidden fields as needed:
   - `_subject`: Email subject line
   - `_next`: Redirect URL after submission
   - `_autoresponse`: Automatic reply message

## Development Notes

- The thank you message can be previewed by adding `#preview-thank-you` to the URL
- CAPTCHA implementation is entirely client-side for demonstration purposes
- For production use, consider implementing server-side validation

## License

MIT License

## Credits

- Fonts: Space Grotesk, Syncopate (Google Fonts)
- Icons: Custom implementation
- Libraries: Three.js, GSAP, Locomotive Scroll, Lottie 