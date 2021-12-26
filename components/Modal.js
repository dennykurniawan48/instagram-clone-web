import { useRecoilState } from "recoil"
import { modalState } from "../atoms/modalAtom"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useRef, useState } from "react"

import {addDoc, collection, doc, serverTimestamp, updateDoc} from "firebase/firestore"
import { db, storage } from "../firebase"
import { useSession } from "next-auth/react"

import{
    CameraIcon
} from "@heroicons/react/solid"
import { ref, getDownloadURL, uploadString } from "firebase/storage"

function Modal() {
    const [open, setOpen] = useRecoilState(modalState)
    const refInputFile = useRef(null)
    const refInputCaption = useRef("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const {data: session} = useSession()

    const uploadPost = async() => {
        if(loading) return
        setLoading(true)

        const docRef = await addDoc(collection(db, 'posts'),{
            username: session.user.name,
            caption: refInputCaption.current.value,
            profileImg: session.user.image,
            timestamp: serverTimestamp()
        })

        const imageRef = ref(storage, `posts/${docRef.id}/images`)

        await uploadString(imageRef, selectedFile, "data_url").then(async snapshot => {
            const downloadUrl = await getDownloadURL(imageRef)
            await updateDoc(doc(db, 'posts', docRef.id), {
                image: downloadUrl
            })
        })

        setOpen(false)
        setLoading(false)
        setSelectedFile(null)
    }

    const changeInputFile = (e) => {
        const reader = new FileReader()
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
            as='div'
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={setOpen}>
                <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                    as={Fragment}
                    entered="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                        &#8203;
                    </span>
                    <Transition.Child
                    as={Fragment}
                    entered="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:scale-95">
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                {selectedFile ? <img src={selectedFile} classname="w-full object-contain cursor-pointer" onClick={() => setSelectedFile(null)}/> : <div onClick={() => { refInputFile.current.click() }} className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer">
                                    <CameraIcon className="h-5 w-5 text-red-500" aria-hidden="true"/>
                                </div>}
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title
                                    as="h3"
                                    className="text-lg leading-6 font-medium text-gray-900">
                                        Upload Photo
                                    </Dialog.Title>
                                </div>
                                <div>
                                    <input ref={refInputFile} type="file" hidden onChange={changeInputFile} />
                                </div>
                                <div className="mt-2">
                                    <input ref={refInputCaption} className="border-none focus:ring-0 w-full text-center" type="text" placeholder="enter a caption"/>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                    onClick={uploadPost}
                                    type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus-outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300">
                                        {loading ? "Loading..." : "Upload Post"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Modal
