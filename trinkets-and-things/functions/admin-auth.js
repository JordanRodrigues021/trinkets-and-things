exports.handler = async (event, context) => {
    try {
        // In a real app, this would verify admin credentials
        // For this example, we'll use hardcoded credentials
        const { email, password } = JSON.parse(event.body);
        
        if (email === 'jordanrodrigues021@gmail.com' && password === '123123!@#!@#') {
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
                    message: 'Invalid credentials'
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Login failed',
                details: error.message 
            })
        };
    }
};