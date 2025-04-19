import { Alert } from "react-native"

export const dummyAction = () =>{
  return Alert.alert("Fitalic is under Development", "Press F to pay respects", [{text: "F", style: "default"}])
}