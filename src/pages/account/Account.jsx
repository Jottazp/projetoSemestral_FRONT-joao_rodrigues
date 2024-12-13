import React, { useContext, useState } from "react"
import { Context } from "../../context/Context"
import "./account.css"
import { IoIosAddCircleOutline } from "react-icons/io"
import axios from "axios"

export const Account = () => {
  const { user, dispatch } = useContext(Context)

  // same from create file
  const [file, setFile] = useState(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [succ, setSucc] = useState(false)
  const PublicFlo = "http://localhost:5000/images/"

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: "UPDATE_START" })
    const updateUser = {
      userId: user._id,
      username,
      email,
      password,
    }

    if (file) {
      const data = new FormData()
      const filename = Date.now() + file.name
      data.append("name", filename)
      data.append("file", file)
      updateUser.profilePic = filename

      try {
        await axios.post("/upload", data)
      } catch (error) {
        console.log(error)
      }
    }
    try {
      const res = await axios.put("/users/" + user._id, updateUser)
      setSucc(true)
      dispatch({ type: "UPDATE_SUCC", payload: res.data })
      window.location.reload()
    } catch (error) {
      dispatch({ type: "UPDATE_FAILED" })
    }
  }
  return (
    <>
      <section className='accountInfo'>
        <div className='container boxItems'>
          <h1>Atualizar dados da conta</h1>
          <div className='content'>
          <h5>Adicione sua foto</h5>
            <div className='left'>
              <div className='img flexCenter'>
                <img src={file ? URL.createObjectURL(file) : PublicFlo + user.profilePic} alt='' />
                <label htmlFor='inputfile'>
                  <IoIosAddCircleOutline className='icon' />
                </label>
                <input type='file' id='inputfile' style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
              </div>
            </div>
            <form className='right' onSubmit={handleSubmit}>
              <label htmlFor=''>Nome de usuário</label>
              <input type='text' placeholder={user.username} onChange={(e) => setUsername(e.target.value)} />
              <label htmlFor=''>Email</label>
              <input type='email' placeholder={user.email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor=''>Senha</label>
              <input type='password' onChange={(e) => setPassword(e.target.value)} />
              <h5>Preencha todos os campos antes de clicar</h5>
              <button className='button' type='submit'>
                Atualizar
              </button>
              {succ && <span>Seu perfil foi atualizado</span>}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
