import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button ,Image, Vibration, Pressable} from 'react-native';
import { useState,useEffect } from 'react';
import * as Speech from 'expo-speech';
//import {RNRestart} from 'react-native-restart';

export default function App() {
  const [datum, setDatum] = useState("a");
  const [capture, setCapture] = useState("a");
  const [resp, setResp] = useState(null);
  const url = "http://192.168.43.29/temperature";
  const speak_a = () => {    
    if(resp === null){
      const thingToSay = 'There was some error connecting to server';
    console.log(thingToSay);
    Speech.speak(thingToSay)
    }
    else{
      const thingToSay = 'I can see ' +resp[1].name + ' '+resp[2].name + ' '+resp[3].name + ' '+resp[4].name + ' '+resp[5].name + ' '+resp[6].name;
      console.log(thingToSay);
      Speech.speak(thingToSay)}
  };
  const speakCaptured = () => {
    const thingToSay = 'Image Captured';
    Speech.speak(thingToSay);
  };
  const speakProcess = () => {
    const thingToSay = 'Processing Image';
    Speech.speak(thingToSay);
  };
  const speakDone = () => {
    const thingToSay = 'Processing Done';
    Speech.speak(thingToSay);
  };

  const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

  const step1 = () => {
    speakCaptured();
    fetch("http://192.168.43.29/capture")
    .then(response => response.text())
    .then(data => setCapture(data))
    .then(() => {
      toDataURL('http://192.168.43.29/saved-photo')
    .then(dataUrl => {
      console.log("image new");
      setDatum(dataUrl);})
      .then(step2)
  })}
  
    getResp = (url) => {
    fetch("https://chubby-terms-suffer-115-240-194-54.loca.lt/clarifai", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "hello": url }),
    })
.then(res=>res.json())
.then(data =>
   setResp(data)
)
}
  

  const step2 = () => {
    speakProcess();
    toDataURL('http://192.168.43.29/saved-photo')
    .then(dataUrl => {
      setDatum(dataUrl);
      console.log("image n");
      getResp(dataUrl);
      setTimeout(() => {speakDone()},7000);})
  }

 
  return (
    <View style={styles.container}>
      <Text>{capture}</Text>
      <Image
        style={{width:400,height: 200,resizeMode: 'contain'}}
        source={{uri:datum}}
      />
      <Pressable style={styles.button} onPress = {step1}>
        <Text style={styles.text}>Capture</Text>
      </Pressable>

      <Pressable style={styles.button3} onPress={speak_a}>
        <Text style={styles.text}>Listen</Text>
      </Pressable>
      {/*<Button title="Press to hear some words" onPress={speak} />*/}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    height:"30%",
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  },
  button3: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    height:"30%",
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 30,
    color: "white"
  }
});

