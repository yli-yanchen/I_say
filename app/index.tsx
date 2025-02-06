import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS } from '../colors';

export default function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  // const [useDeepThink, setUseDeepThink] = useState(false);
  const [exportFormat, setExportFormat] = useState<'DOC' | 'PDF'>('PDF');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendQuestion = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }
    setIsLoading(true);
    try {
      const apiResponse = await fetch(
        'https://api.deepseek.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            // model: useDeepThink ? 'R1' : 'base',
            messages: [{ role: 'user', content: question }],
          }),
        }
      );
      const data = await apiResponse.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      Alert.alert('Error', 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Hi, I'm ISAY</Text>
            <Text style={styles.subtitle}>How can I help you today?</Text>
          </View>

          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder='What is your question?'
              placeholderTextColor={COLORS.textSecondary}
              value={question}
              onChangeText={setQuestion}
              multiline
            />
            {/* <View style={styles.optionRow}>
              <Text style={styles.optionText}>Use DeepThink (R1 Model)</Text>
              <Switch
                value={useDeepThink}
                onValueChange={setUseDeepThink}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View> */}

            <View style={styles.exportButtons}>
              <Text style={styles.optionText}>Export Format:</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.exportButton,
                    exportFormat === 'DOC'
                      ? styles.selectedButton
                      : styles.unselectedButton,
                  ]}
                  onPress={() => setExportFormat('DOC')}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      exportFormat === 'DOC'
                        ? styles.selectedText
                        : styles.unselectedText,
                    ]}
                  >
                    DOC
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.exportButton,
                    exportFormat === 'PDF'
                      ? styles.selectedButton
                      : styles.unselectedButton,
                  ]}
                  onPress={() => setExportFormat('PDF')}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      exportFormat === 'PDF'
                        ? styles.selectedText
                        : styles.unselectedText,
                    ]}
                  >
                    PDF
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title='Send Question'
              onPress={handleSendQuestion}
              color={COLORS.primary}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    position: 'absolute',
    top: '20%',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  content: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    minHeight: 50,
    backgroundColor: '#f9f9f9',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  optionText: {
    color: COLORS.textPrimary,
  },
  exportButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
    borderRadius: 12,
  },
  exportButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  unselectedButton: {
    backgroundColor: '#ccc', // 灰色
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
  },
  unselectedText: {
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10, // 按钮间距
  },
});
