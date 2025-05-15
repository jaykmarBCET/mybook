import React, { useCallback, useState } from 'react';
import useUserStore from '../../store/user/User.api';

function RegisterPage() {
  const { register } = useUserStore();
  const [data, setData] = useState({ email: "", name: "", password: '', dob: '' });
  const [errors, setErrors] = useState({});

  const changeHandel = useCallback((e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error on change
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!data.email) newErrors.email = "Email is required";
    if (!data.name) newErrors.name = "Name is required";
    if (!data.password) newErrors.password = "Password is required";
    if (!data.dob) newErrors.dob = "Date of Birth is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  },[data]);

  const HandlerSubmit = useCallback(async () => {
    if (validate()) {
      try {
        await register(data);
        
      } catch (error) {
        console.error("Registration failed:", error);
        alert("Registration failed. Please try again."); // Improve error message based on error
      }
    } else {
      alert("Please correct the errors in the form.");
    }
  }, [data, register,validate]);

  return (
    <div className='border w-full h-full flex flex-col justify-center items-center'>
      <div className='sm:w-72 w-96 min-h-96 shadow-lg shadow-blue-400 px-2 py-2 rounded-2xl border bg-gray-100'>
        <h1 className='text-xl font-semibold text-center'>Register</h1>

        <form onSubmit={(e) => { e.preventDefault(); HandlerSubmit(); }}>
          {["name", "email", "password", "dob"].map((field, idx) => (
            <div key={idx} className='flex px-2 py-2 my-1 gap-5 justify-center items-center'>
              <label htmlFor={field} className='text-sm font-semibold text-blue-500 capitalize'>
                {field === "dob" ? "DOB" : field}
              </label>
              <input
                onChange={changeHandel}
                className='text-sm font-semibold outline-none text-blue-500 border-b'
                type={field === "password" ? "password" : field === "dob" ? "date" : field}
                name={field}
                id={field}
                placeholder={`Enter ${field}`}
              />
              {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
            </div>
          ))}
          <button type="submit" className='btn bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-xl shadow-xl w-full mt-2'>Register</button>
        </form>
        <a href="/login" className='text-blue-500 text-sm'>Already have an account</a>
      </div>
    </div>
  );
}

export default RegisterPage;