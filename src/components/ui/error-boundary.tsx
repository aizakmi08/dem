import { Component, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { lightColors } from '@/theme/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Pressable style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightColors.background,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    color: lightColors.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: lightColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
  },
});
