import {useState} from "react";//lets this component remember values between renders

function GeneralInfo(){//defines the component for personal info section
    const[name, setName]=useState("");//name=current value of the name field, starts as empty string, setName is a function to update it.
    const [email, setEmail]=useState("");
    const [phone, setPhone]=useState("");

    const [isEditing, setIsEditing]=useState(true);//true means show the form, false means show the preview

    return(
        <section>
            <h2>General Info</h2>

            {
                isEditing ? (//if file is true render the forms inputs
                    <>{/*groups elements without adding an extra DOM node*/}
                        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
                        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <input type="text" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                        <button onClick={()=>setIsEditing(false)}> Submit</button>
                    </>
                ):(//if isEditing is false, render the read-only preview
                    <>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone:</strong> {phone}</p>
                        {/*displays the default data */}
                        <button onClick={()=>setIsEditing(true)}>Edit</button>
                    </>
                )
            }
        </section>
    );

}

export default GeneralInfo;
