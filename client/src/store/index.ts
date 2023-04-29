import { defineStore } from 'pinia'
import { User } from '../interfaces'

export type State = {
    token: string,
    user: User | {},
    logged: boolean,
    alert_text: string,
    alert_show: boolean,
    alert_status: string
}

export default defineStore({
    id: 'mainStore',
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user')!) || {},
        logged: !!localStorage.getItem('token'),
    } as State),
    actions: {
        changeUser(user: any){
            this.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        changeToken(token: string){
            this.token = token
            localStorage.setItem('token', token)
        },
        logout(){
            this.token = ''
            this.user = {}
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        changeAlert(payload: any, open: boolean){
            if(open){
                this.alert_show = true
                this.alert_status = payload.status
                this.alert_text = payload.text
            }else{
                this.alert_show = false
                this.alert_status = ''
                this.alert_text = ''
            }
        }
    }
})