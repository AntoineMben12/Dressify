// Test script for Dressify full-stack application
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackend() {
  console.log('🚀 Testing Dressify Backend API...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running:', healthResponse.status);
    
    // Test 2: Test signup
    console.log('\n2. Testing user signup...');
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    };
    
    const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, signupData);
    console.log('✅ Signup successful:', signupResponse.data.message);
    const token = signupResponse.data.token;
    
    // Test 3: Test login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'TestPass123!'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data.message);
    
    // Test 4: Test protected route
    console.log('\n4. Testing protected route...');
    const headers = { Authorization: `Bearer ${token}` };
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, { headers });
    console.log('✅ Protected route works:', meResponse.data.user.name);
    
    // Test 5: Test creating a post
    console.log('\n5. Testing post creation...');
    const postData = {
      title: 'Test Fashion Post',
      content: 'This is a test post about fashion trends.',
      category: 'Fashion Trends',
      status: 'published'
    };
    
    const postResponse = await axios.post(`${BASE_URL}/posts`, postData, { headers });
    console.log('✅ Post created:', postResponse.data.post.title);
    
    // Test 6: Test creating a product
    console.log('\n6. Testing product creation...');
    const productData = {
      name: 'Test Fashion Item',
      description: 'A beautiful test fashion item.',
      price: 99.99,
      category: 'Clothing',
      stock: 10
    };
    
    const productResponse = await axios.post(`${BASE_URL}/products`, productData, { headers });
    console.log('✅ Product created:', productResponse.data.product.name);
    
    // Test 7: Test getting user's posts
    console.log('\n7. Testing user posts retrieval...');
    const userPostsResponse = await axios.get(`${BASE_URL}/posts/my-posts`, { headers });
    console.log('✅ User posts retrieved:', userPostsResponse.data.posts.length, 'posts');
    
    // Test 8: Test getting user's products
    console.log('\n8. Testing user products retrieval...');
    const userProductsResponse = await axios.get(`${BASE_URL}/products/my-products`, { headers });
    console.log('✅ User products retrieved:', userProductsResponse.data.products.length, 'products');
    
    console.log('\n🎉 All backend tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Server health: ✅');
    console.log('- User authentication: ✅');
    console.log('- Protected routes: ✅');
    console.log('- Post CRUD: ✅');
    console.log('- Product CRUD: ✅');
    console.log('- User data retrieval: ✅');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure to start the backend server first:');
      console.log('   cd backend && npm start');
    }
  }
}

async function testFrontend() {
  console.log('\n🌐 Testing Frontend Accessibility...\n');
  
  try {
    const response = await axios.get(FRONTEND_URL);
    console.log('✅ Frontend is accessible:', response.status);
    console.log('✅ React app is running on port 3000');
  } catch (error) {
    console.error('❌ Frontend test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure to start the frontend server:');
      console.log('   cd frontend && npm start');
    }
  }
}

async function runTests() {
  console.log('🧪 Dressify Full-Stack Application Test Suite\n');
  console.log('='.repeat(50));
  
  await testBackend();
  await testFrontend();
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test suite completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Start backend: cd backend && npm start');
  console.log('2. Start frontend: cd frontend && npm start');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('4. Test the login/signup flow');
  console.log('5. Access the Dashboard and create posts/products');
}

// Run the tests
runTests();
