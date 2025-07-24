const { default: Airtable } = require('airtable');

exports.handler = async (event, context) => {
    try {
        // Initialize Airtable
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
        
        // Get all products from Airtable
        const records = await base('Products').select({
            view: 'Grid view'
        }).all();
        
        // Format the products data
        const products = records.map(record => ({
            id: record.id,
            Name: record.get('Name'),
            Description: record.get('Description'),
            Price: record.get('Price'),
            SalePrice: record.get('SalePrice'),
            Images: record.get('Images'),
            Colors: record.get('Colors'),
            Stock: record.get('Stock'),
            SKU: record.get('SKU'),
            Featured: record.get('Featured')
        }));
        
        return {
            statusCode: 200,
            body: JSON.stringify(products)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to fetch products',
                details: error.message 
            })
        };
    }
};