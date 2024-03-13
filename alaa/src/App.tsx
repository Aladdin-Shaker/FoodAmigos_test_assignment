import { SparkleIcon } from 'lucide-react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import Routes from './Routes'
import store from './store'

function App() {
  const persistor = persistStore(store)

  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={
          <div className="fixed left-0 right-0 h-screen flex justify-center items-center">
            <SparkleIcon className="animate-spin text-2xl" />
          </div>
        }
      >
        <Routes />
      </PersistGate>
    </Provider>
  )
}

export default App
