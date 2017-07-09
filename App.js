import React from 'react';
import { StyleSheet, Text, View, Image, Button, ActivityIndicator } from 'react-native';
import queryString from 'query-string';

class Buttons extends React.Component {
  render() {
    const { fetchImage, like, email } = this.props;
    return (
      <View>
        <Button onPress={fetchImage} title="I want another!" />
        <Button onPress={like} title="I love it!" />
        <Button onPress={email} title="Share with mom"  />
      </View>
    );
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      imageUrl: '',
    };
  }

  componentWillMount() {
    this.handlePress();
  }

  handlePress = () => {
    this.setState({ loading: true });
    fetch('http://thecatapi.com/api/images/get')
      .then(response => {
        console.log(response);
        this.setState({ imageUrl: response.url, loading: false });
      });
  }

  handleLike = () => {
    console.log('I like ' + this.state.imageUrl);
  }

  handleEmail = () => {
    // Custom email feature
    this.setState({ emailing: true }); // Mark the loading

    const apiKey = 'key-ae1f6f860d25b28a2de63f76ad55758e';

    const body = {
      from: 'Something Original <postmaster@sambalana.com>',
      to: ['Sam <sambalana247@gmail.com>'],
      subject: 'MOM! GET THE CAMERA!',
      html: `I found something really cool: <img src="${this.state.imageUrl}" />`,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: queryString.stringify(body),
    };

    fetch(`https://api:${apiKey}@api.mailgun.net/v3/sambalana.com/messages`, options)
      .then((response) => { 
        return response.json();
      })
      .then((json) => {
        console.log(json);
        console.log(options);
        this.setState({ emailing: false }); // Set the loading state to false
      });

  }

  render() {
    const title = this.props.title;
    const { loading, emailing } = this.state;
    return (
      <View>
        <Text>{title}</Text>
        {loading === true ? (
          <ActivityIndicator />
        ) : (
          <Image
            source={{ uri: this.state.imageUrl }}
            style={{ width: 300, height: 300 }}
          />
        )}
        <Buttons
          fetchImage={this.handlePress}
          like={this.handleLike}
          email={this.handleEmail}
        />
        {emailing ? <ActivityIndicator /> : <View />}
      </View>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Card title="My custom cat" />
        <Text>Include advertisements here.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
