import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  PermissionsAndroid,
  Button,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import dateFormat, {masks} from 'dateformat';
import {PdfCode} from '../Components/Pdf';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

export default function BillCreate() {
  const currentDate = new Date();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [receivedBalance, setReceivedBalance] = useState('');
  const [remainingBalance, setRemainingBalance] = useState('');
  const [quantity, setQuantity] = useState('');
  const [invoice, setInvoice] = useState(
    dateFormat(currentDate, 'ddmmyyhhMss'),
  );
  const [total, setTotal] = useState('');
  const [product, setProduct] = useState('Tshirt');

  const [paymentType, setPaymentType] = useState('credit');

  const productItems = [
    'Tshirt',
    'Jeans',
    'Top',
    'Sand box',
    'IceBox',
    'Lipstick',
    'HomeDecor',
  ];

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const requestPermission = async () => {
    console.log('requesPrimsindn chala');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: ' App Write Permission',
          message: ' App needs access to your storage ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage', granted);
        printInvoice();
      } else {
        console.log('permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onShare = () => {
    console.log('onshare chala');

    Share.open(printInvoice())
      .then(res => {
        console.log('res of share', res);
      })
      .catch(err => {
        err && console.log('err on share', err);
      });
  };

  const downloadAndSavePDF = async file => {
    console.log('file', file);
    try {
      const url = file.filePath;
      const fileName = `Html_to_Pdf${dateFormat(Date.now())}`;
      const downloadsDirectory = RNFS.DownloadDirectoryPath;

      console.log('downloadsDirectory>>>>>>>>>>>>>>>', downloadsDirectory);

      console.log('fileNaeme', fileName);

      const sanitizedFileName = fileName.replace(/\s/g, '_'); // Replace spaces with underscores
      const downloadOptions = {
        fromUrl: url,
        toFile: `${downloadsDirectory}/${sanitizedFileName}`,
      };
      console.log('downlaodOptons', downloadOptions);
      console.log('sanitieUrl', sanitizedFileName);

      const downloadResult = await RNFS.downloadFile(downloadOptions);

      console.log('Downaoadressult', downloadResult);

      if (downloadResult) {
        console.log('PDF downloaded successfully!');
      } else {
        console.log(
          'Failed to download PDF. Status code:',
          downloadResult.statusCode,
        );
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const downloadPdf = uri => {
    console.log('capture ref ', uri);
    let destPath;

    if (Platform.OS == 'android') {
      console.log('yaha isme aya android wale me');
      destPath = `${
        RNFS.DownloadDirectoryPath
      }/${new Date().toISOString()}.pdf`.replace(/:/g, '-');
    } else {
      destPath = `${
        RNFS.LibraryDirectoryPath
      }/${new Date().toISOString()}.pdf`.replace(/:/g, '-');
    }
    console.log('Image saved to', 'destPath', destPath);

    (async function () {
      RNFS.copyFile(uri, destPath)
        .then(res => {
          console.log('copyFile', res);
          Alert.alert(
            '',
            'PDF saved successfully to downloads folder.',
            [{text: 'OK', onPress: () => {}}],
            {cancelable: false},
          );
        })
        .catch(err => {
          console.log('err.message', err.message);
        });
    })();
  };

  const printInvoice = async () => {
    try {
      let html = PdfCode(
        name,
        address,
        mobile,
        quantity,
        invoice,
        product,
        total,
        receivedBalance,
        paymentType,
        remainingBalance,
      );
      let options = {
        html: html,
        fileName: `Html_to_Pdf${dateFormat(Date.now())}`,
        directory: 'Downloads',
      };

      let file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);
      // downloadPdf(file.filePath);
      // downloadAndSavePDF(file);
      Alert.alert(
        'PDF saved successfully to downloads folder.',
        `${file.filePath}`,
        [{text: 'OK', onPress: () => {}}],
        {cancelable: false},
      );
      // alert(file.filePath);
      // return file.filePath;
    } catch (error) {
      alert('permission denied ! please give permission first to save pdf');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Name :</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setName(text)}
            value={name}
            placeholder="Full Name"
          />
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Address : </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setAddress(text)}
            value={address}
            placeholder="Address"
          />
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Mobile No : </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            onChangeText={text => setMobile(text)}
            value={mobile}
            placeholder="Mobile No"
          />
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Product : </Text>
          <View style={styles.PickerContainer}>
            <Picker
              selectedValue={product}
              style={styles.Picker}
              onValueChange={(itemValue, itemIndex) => setProduct(itemValue)}>
              {productItems.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Quantity : </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={text => setQuantity(text)}
            value={quantity}
            placeholder="Quantity"
          />
        </View>
        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Invoice No : </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setInvoice(text)}
            value={invoice}
            placeholder="Invoice No"
          />
        </View>
        {/* Total  */}
        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Total : </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={text => setTotal(text)}
            value={total}
            placeholder="Total ₹"
          />
        </View>

        {/* ReceivedBalance  */}
        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Received Amount : </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={text => setReceivedBalance(text)}
            value={receivedBalance}
            placeholder="Received Amount ₹"
          />
        </View>
        {/* Remaining Balance  */}
        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Remaining Balance : </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={text => setRemainingBalance(text)}
            value={remainingBalance}
            placeholder="Remaining Balance ₹"
          />
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.textLabelStyle}>Payment Method : </Text>
          <View style={styles.PickerContainer}>
            <Picker
              selectedValue={paymentType}
              style={styles.Picker}
              onValueChange={(itemValue, itemIndex) =>
                setPaymentType(itemValue)
              }>
              <Picker.Item label="Credit" value="Credit" />
              <Picker.Item label="Cash" value="Cash" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => requestPermission()}
            style={[styles.CreateInvoiceButton, {backgroundColor: 'green'}]}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
              GENERATE INVOICE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onShare()}
            style={[styles.CreateInvoiceButton, {backgroundColor: 'blue'}]}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
              SHARE
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  CreateInvoiceButton: {
    elevation: 5,
    marginVertical: 15,
    marginHorizontal: 10,
    height: 50,
    width: '45%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  InputContainer: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  textInput: {
    marginTop: 4,
    height: 40,
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
    marginBottom: 6,
  },
  textLabelStyle: {
    color: 'green',
    fontSize: 16,
  },
  PickerContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 4,
    height: 50,
  },
});
