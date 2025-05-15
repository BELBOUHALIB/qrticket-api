import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

// Mock data pour l'historique des scans
const mockHistory = [
  {
    id: '1',
    ticketId: 'TICKET-1234',
    eventName: 'Festival de Musique',
    scanDate: new Date(2024, 2, 15, 14, 30),
    status: 'valid',
  },
  {
    id: '2',
    ticketId: 'TICKET-5678',
    eventName: 'Conférence Tech',
    scanDate: new Date(2024, 2, 15, 15, 45),
    status: 'invalid',
  },
  // Ajoutez plus d'éléments d'historique ici
];

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: typeof mockHistory[0] }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.ticketId}>{item.ticketId}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'valid' ? styles.validBadge : styles.invalidBadge
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'valid' ? 'Valide' : 'Invalid'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.scanDate}>
        {item.scanDate.toLocaleString('fr-FR')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucun historique de scan disponible
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validBadge: {
    backgroundColor: '#dcfce7',
  },
  invalidBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eventName: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  scanDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});