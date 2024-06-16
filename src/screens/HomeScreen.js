
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Modal, Dialog, Paragraph, Portal, Provider as PaperProvider } from 'react-native-paper';
import fetchData from '../../api/components';

const PantallaAdmin = ({ logueado, setLogueado }) => {

  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleEliminar, setVisibleEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const [idActualizar, setIdActualizar] = useState(null);

  const mostrarModal = () => setVisibleModal(true);
  const cerrarModal = () => {
    setVisibleModal(false);
    setIdActualizar(null);
    limpiarCampos();
  };

  const mostrarEliminar = (id) => {
    setIdEliminar(id);
    setVisibleEliminar(true);
  };

  const cerrarEliminar = () => setVisibleEliminar(false);

  const API_ADMINISTRADORES = 'services/admin/administrador.php';

  const [datosAdmin, setDatosAdmin] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [alias, setAlias] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [error, setError] = useState(null);

  const llenarLista = async () => {
    try {
      const data = await fetchData(API_ADMINISTRADORES, 'readAll');
      setDatosAdmin(data.dataset);
    } catch (error) {
      setError(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    llenarLista();
  }, []);

  useFocusEffect(
    useCallback(() => {
      llenarLista();
    }, [])
  );

  const confirmarEliminacion = () => {
    eliminarRegistro(idEliminar);
  };

  const eliminarRegistro = async (id) => {
    try {
      const form = new FormData();
      form.append('idAdministrador', id);
      const data = await fetchData(API_ADMINISTRADORES, 'deleteRow', form);
      if (data.status) {
        Alert.alert(data.message);
        llenarLista();
      } else {
        Alert.alert('Error ' + data.error);
      }
    } catch (error) {
      Alert.alert('Error al acceder a la API ' + error);
    }
    cerrarEliminar();
  };

  const actualizarRegistro = async () => {
    try {
      const form = new FormData();
      form.append('idAdministrador', idActualizar);
      form.append('nombreAdministrador', nombre);
      form.append('apellidoAdministrador', apellido);
      form.append('correoAdministrador', correo);
      const data = await fetchData(API_ADMINISTRADORES, 'updateRow', form);
      if (data.status) {
        Alert.alert(data.message);
        limpiarCampos();
        llenarLista();
        cerrarModal();
      } else {
        Alert.alert('Error ' + data.error);
      }
    } catch (error) {
      Alert.alert('Error al acceder a la API ' + error);
    }
  };

  const insertarRegistro = async () => {
    try {
      const form = new FormData();
      form.append('nombreAdministrador', nombre);
      form.append('apellidoAdministrador', apellido);
      form.append('correoAdministrador', correo);
      form.append('aliasAdministrador', alias);
      form.append('claveAdministrador', clave);
      form.append('confirmarClave', confirmarClave);
      const data = await fetchData(API_ADMINISTRADORES, 'createRow', form);
      if (data.status) {
        Alert.alert(data.message);
        limpiarCampos();
        llenarLista();
        cerrarModal();
      } else {
        Alert.alert('Error ' + data.error);
      }
    } catch (error) {
      Alert.alert('Error al acceder a la API ' + error);
    }
  };

  const abrirActualizar = async (id) => {
    const form = new FormData();
    form.append('idAdministrador', id);
    const data = await fetchData(API_ADMINISTRADORES, 'readOne', form);
    if (data.status) {
      const fila = data.dataset;
      setIdActualizar(fila.id_administrador);
      setNombre(fila.nombre_administrador);
      setApellido(fila.apellido_administrador);
      setCorreo(fila.correo_administrador);
      setAlias('');
      setClave('');
      setConfirmarClave('');
      mostrarModal();
    } else {
      Alert.alert('Error', data.error);
    }
  };

  const handleSubmit = () => {
    if (idActualizar) {
      actualizarRegistro();
    } else {
      insertarRegistro();
    }
  };

  const limpiarCampos = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setAlias('');
    setClave('');
    setConfirmarClave('');
  };

  const handleCerrarSesion = async () => {
    const data = await fetchData(API_ADMINISTRADORES, 'logOut');
    try {
      if (data.status) {
        setLogueado(false);
      } else {
        Alert.alert('Error de sesión', data.error);
      }
    } catch (error) {
      console.log(data);
      Alert.alert('Error de sesión', data.error);
    }
  };

  if (cargando) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>ID: </Text>{item.id_administrador}</Text>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>Nombre: </Text>{item.nombre_administrador}</Text>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>Apellido: </Text>{item.apellido_administrador}</Text>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>Correo: </Text>{item.correo_administrador}</Text>
      <Text style={styles.cardText}><Text style={styles.cardLabel}>Alias: </Text>{item.alias_administrador}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonUpdate} onPress={() => abrirActualizar(item.id_administrador)}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonDelete} onPress={() => mostrarEliminar(item.id_administrador)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>¡Bienvenido a la aplicación!</Text>
        {error && (
          <Text style={styles.errorText}>Error: {error.message}</Text>
        )}
        <Portal>
          <Modal visible={visibleModal} onDismiss={cerrarModal} style={styles.modal}>
            <View style={styles.inputContainer}>
              <View style={styles.rowContainer}>
                <Text style={styles.title}>
                  {idActualizar ? 'Actualizar Administrador' : 'Agregar Administrador'}
                </Text>
                <TouchableOpacity style={styles.buttonClose} onPress={cerrarModal}>
                  <Text style={styles.buttonText}>X</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder='Nombre del administrador'
                onChangeText={setNombre}
                value={nombre}
                keyboardType='default'
                style={styles.input}
              />
              <TextInput
                placeholder='Apellido del administrador'
                onChangeText={setApellido}
                value={apellido}
                keyboardType='default'
                style={styles.input}
              />
              <TextInput
                placeholder='Correo del administrador'
                onChangeText={setCorreo}
                value={correo}
                keyboardType='email-address'
                style={styles.input}
              />
              <TextInput
                placeholder='Alias del administrador'
                onChangeText={setAlias}
                value={alias}
                keyboardType='default'
                style={styles.input}
                editable={!idActualizar}
              />
              <TextInput
                placeholder='Clave del administrador'
                onChangeText={setClave}
                value={clave}
                secureTextEntry
                style={styles.input}
                editable={!idActualizar}
              />
              <TextInput
                placeholder='Repetir clave del administrador'
                onChangeText={setConfirmarClave}
                value={confirmarClave}
                secureTextEntry
                style={styles.input}
                editable={!idActualizar}
              />
              <TouchableOpacity style={styles.buttonAdd} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{idActualizar ? 'Actualizar administrador' : 'Agregar administrador'}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Dialog visible={visibleEliminar} onDismiss={cerrarEliminar}>
            <Dialog.Title>Confirmar Eliminación</Dialog.Title>
            <Dialog.Content>
              <Paragraph>¿Estás seguro de que deseas eliminar este registro?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={cerrarEliminar}>Cancelar</Button>
              <Button onPress={confirmarEliminacion}>Aceptar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Button style={styles.buttonAdd} onPress={mostrarModal}>
          <Text style={styles.buttonText}>Agregar registro</Text>
        </Button>
        <FlatList
          data={datosAdmin}
          renderItem={renderItem}
          keyExtractor={item => item.id_administrador.toString()}
          contentContainerStyle={styles.list}
        />
        <Button mode="contained" onPress={handleCerrarSesion} style={styles.button}>
          Cerrar Sesión
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    margin: 20,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#00FFFF',
    borderRadius: 8,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
  },
  buttonAdd: {
    backgroundColor: '#00FFFF',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonUpdate: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonDelete: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonClose: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '100%',
  },
  cardText: {
    fontSize: 18,
    marginBottom: 5,
  },
  cardLabel: {
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  list: {
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modal: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 5,
    opacity: 1,
    elevation: 5,
  }
});

export default PantallaAdmin;
