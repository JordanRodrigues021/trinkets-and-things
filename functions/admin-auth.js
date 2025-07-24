exports.handler = async (event, context) => {
    try {
        // Parse the incoming data
        const { email, password } = JSON.parse(event.body);
        
        // Hardcoded admin credentials (replace with your actual credentials)
        const ADMIN_EMAIL = 'jordanrodrigues021@gmail.com';
        const ADMIN_PASSWORD = '123123!@#!@#';
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true,
                    message: 'Login successful'
                })
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ 
                    success: false,
                    message: 'Invalid email or password'
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false,
                error: 'Login failed',
                details: error.message 
            })
        };
    }
};
