import moment from 'moment'
import Utils from './services'
export default {
  initState () {
    var state = {
    // fees
      fees: {
        fees: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {},
          sortParams: {param: 'updated_at', order: 'DESC'}
        },
        currentFee: {
          data: {},
          state: 'LOADING'
        }
      },
      //   roles
      roles: {
        roles: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {},
          sortParams: {param: 'updated_at', order: 'DESC'}
        },
        currentRole: {
          data: {},
          state: 'LOADING'
        },
        privileges: {
          data: [],
          state: 'LOADING'
        }
      },
      user: {
        user: {
          data: {},
          token: localStorage.getItem('token'),
          client_id: '',
          client_secret: ''
        },
        userdata: {},
        client: {},
        logIn: localStorage.getItem('login'),
        test: false,
        permissions: {
          data: []
        },
        pageLoading: false,
        isAdmin: Utils.returnBool(localStorage.getItem('isAdmin')),
        pageSize: 12,
        balance: {}
      },
      transactions: {
        transactions: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {},
          sortParams: {param: 'updated_at', order: 'DESC'}
        },
        queues: {
          data: [],
          state: 'LOADING',
          filters: {},
          meta: {}
        },
        currentTransaction: {
          data: {},
          state: 'LOADING'
        },
        pending: {
          data: [],
          state: 'LOADING',
          filters: {},
          meta: {}
        },
        providers: [
          {label: 'MTN', value: 'mtn'},
          {label: 'Vodafone', value: 'vodafone'},
          {label: 'Tigo', value: 'tigo'},
          {label: 'Airtel', value: 'airtel'}
        ]
      },
      jobs: {
        jobs: {
          data: [],
          state: 'LOADING',
          count: 0
        },
        currentJob: {
          data: {},
          state: 'LOADING',
          runs: [],
          currentRuns: [],
          runState: 'DATA',
          currentRun: {},
          currentRunState: 'LOADING'
        },
        file: {},
        fileState: 'DATA'
      },
      dashboard: {
        dashboard: {
          data: [],
          state: 'LOADING',
          filters: {}
        },
        today: {
          data: [],
          state: 'LOADING',
          sum: 0
        }
      },
      contacts: {
        contacts: {
          data: [],
          state: 'LOADING',
          count: 0
        },
        currentContacts: {
          data: []
        },
        currentContact: {
          data: {},
          schedules: [],
          transactions: [],
          state: 'LOADING'
        }
      },
      payouts: {
        payouts: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {},
          sortParams: {param: 'updated_at', order: 'DESC'}
        }
      },
      reports: {
        fields: {
          data: [],
          state: 'DATA'
        },
        link: ''
      },
      teams: {
        teams: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {},
          sortParams: {param: 'updated_at', order: 'DESC'}
        }
      },
      branches: {
        branches: {
          data: [],
          state: 'DATA',
          errors: [],
          filters: {}
        }
      },
      fonemessenger: {
        messages: {
          data: [],
          state: 'LOADING',
          count: 0
        }
      },
      disputes: {
        disputes: {
          data: [],
          state: 'LOADING',
          count: 0,
          filters: {}
        }
      },
      topups: {
        topups: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {
            from: moment().startOf('month').format('YYYY-MM-DD'),
            to: moment().endOf('month').format('YYYY-MM-DD')
          }
        }
      },
      settlements: {
        settlements: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {
            from: moment().startOf('month').format('YYYY-MM-DD'),
            to: moment().endOf('month').format('YYYY-MM-DD')
          }
        }
      },
      accounts: {
        accounts: {
          data: [],
          state: 'LOADING',
          count: 0
        },
        currentAccounts: {
          data: []
        },
        currentAccount: {
          data: {},
          branches: [],
          users: [],
          settings: [],
          usersState: 'LOADING',
          branchesState: 'LOADING',
          state: 'LOADING',
          privileges: []
        }
      },
      accountsSettlements: {
        accountSettlements: {
          data: [],
          state: 'LOADING',
          count: 0
        },
        currentAccountSettlements: {
          data: []
        }
      },
      accountFees: {
        accountFees: {
          data: [],
          state: 'LOADING',
          count: 0
        },
        currentAccountFees: {
          data: []
        }
      },
      logs: {
        logs: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {},
          sortParams: { param: 'updated_at', order: 'DESC' }
        },
        currentLog: {
          data: {},
          state: 'LOADING'
        }
      },
      events: {
        events: {
          data: [],
          meta: {},
          error: [],
          state: 'DATA',
          filters: {},
          sortParams: { param: 'updated_at', order: 'DESC' }
        },
        currentEvent: {
          data: {},
          state: 'LOADING'
        }
      },
      webhook: {
        hooks: {
          data: [],
          meta: {page: 1},
          errors: [],
          state: 'DATA',
          filters: {},
          sortParams: { param: 'updated_at', order: 'DESC' }
        },
        currentHook: {
          data: {},
          state: 'LOADING'
        }
      }
    }

    return state
  }
}
