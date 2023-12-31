import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const AlertCard = ({ note, db, alertId }) => {
    const [decimalValue, setDecimalValue] = useState('');


    const handleSend = () => {
        // Handle the logic for sending the decimal value
        console.log('Decimal Value:', decimalValue);
        console.log('Alert ID:', alertId);
        // You can perform actions here like sending the decimalValue to an API or performing a specific action

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        db.transaction((txn) => {
            const query = `UPDATE DynamicNoteValue
        SET InputParameter = ?
        WHERE DynamicNoteID = ? 
        AND MyDate >= ?
        AND MyDate < ?`;

            txn.executeSql(query, [decimalValue, alertId, formattedDate, tomorrow]);
        });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{note.Title}</Text>

            <View style={styles.inputContainer}>
                {/* Input field for decimal number */}
                <TextInput
                    style={styles.decimalInput}
                    placeholder="Enter decimal number"
                    value={decimalValue}
                    onChangeText={setDecimalValue}
                    keyboardType="decimal-pad"
                />

                {/* Send button */}
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 8,
    },
    dueDate: {
        fontSize: 14,
        color: '#888',
    },
    editButton: {
        color: 'blue',
        marginTop: 8,
    },
    inputContainer: {
        flexDirection: 'row', // Horizontal layout
        alignItems: 'center',
    },

    decimalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 8,
    },
    sendButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AlertCard;