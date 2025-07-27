'use client'

import {create} from 'zustand'
//type of one object
export interface objInStoreType{
categoryName:string
}
//type of store(1.type is object,2.type is fucniton )
export interface store{
store:objInStoreType|null,
setStore:(objInStoreType:objInStoreType)=>void
}
export const useUser=create<store>((set)=>({
store:null, //getting the admin from store 
setStore:store=>set({store})//puting the adminsnmae in store 
}))
