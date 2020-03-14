<template>
  <div class="contact">
        <!-- 联系人卡片 -->
    <van-contact-card
      :type="cardType"
      :name="currentContact.name"
      :tel="currentContact.tel"
      @click="showList = true"
    />

    <!-- 联系人列表 -->
    <van-popup v-model="showList" position="bottom">
      <van-contact-list
        v-model="chosenContactId"
        :list="list"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      />
    </van-popup>

    <!-- 联系人编辑 -->
    <van-popup v-model="showEdit" position="bottom">
      <van-contact-edit
        :contact-info="editingContact"
        :is-edit="isEdit"
        @save="onSave"
        @delete="onDelete"
      />
    </van-popup>
  </div>
</template>

<script>
import { ContactCard, ContactList, ContactEdit ,popup} from 'vant';
let OK = 200;
export default {
  name: 'Contact',
  components:{
    [ContactCard.name]:ContactCard,
    [ContactList.name]:ContactList,
    [ContactEdit.name]:ContactEdit,
    [popup.name]:popup,
  },
  data() {
    return {
      chosenContactId: null,
      editingContact: {},
      showList: false,
      showEdit: false,
      isEdit: false,
      list: []
    }
  },
  computed: {
    cardType() {
      return this.chosenContactId !== null ? 'edit' : 'add';
    },

    currentContact() {
      const id = this.chosenContactId;
      return id !== null ? this.list.filter(item => item.id === id)[0] : {};
    }
  },

  methods: {
    // 添加联系人
    onAdd() {
      this.isEdit = false;
      this.showEdit = true;
    },

    // 编辑联系人
    onEdit(item) {
      this.isEdit = true;      
      this.showEdit = true;
      this.editingContact = item;
    },

    // 选中联系人
    onSelect() {
      this.showList = false;
    },

    // 保存联系人
    async onSave(info) {
      this.showEdit = false;
      this.showList = false;
      let body = ""
      if (this.isEdit) {
        // this.list = this.list.map(item => item.id === info.id ? info : item);
        // body = await axios({
        //   url:"http://localhost:9000/api/contact/edit",
        //   method:"put",
        //   data:{
        //     name:info.name,
        //     tel:info.tel,
        //     id:info.id
        //   }
        // })
        body = await this.$http.contact.updateContact({name:info.name,tel:info.tel,id:info.id})
      } else {
        // 第一种
        // body = await axios({
        //   url:"http://localhost:9000/api/contact/new/json",
        //   method:"post",
        //   data:{
        //     name:info.name,
        //     tel:info.tel
        //   }
        // })
        // 第二种
        // let formData = new FormData();
        // formData.append('name', info.name);
        // formData.append('tel', info.tel );
        // body = await axios({
        //   url:"http://localhost:9000/api/contact/new/form",
        //   method:"post",
        //   data:formData
        // })
        body = await this.$http.contact.addContact({name:info.name,tel:info.tel})
      }
      await this.updateList()
      this.chosenContactId = body.data.data.id;
    },

    // 删除联系人
    async onDelete(info) {
      this.showEdit = false;
      // this.list = this.list.filter(item => item.id !== info.id);
      // let body = await axios({
      //     url:"http://localhost:9000/api/contact",
      //     method:"delete",
      //     params:{"id":info.id}
      // })
      let body = await this.$http.contact.deleteContact({id:info.id})
      if(body.data.code === OK){
          if (this.chosenContactId === info.id) {
          this.chosenContactId = null;
        }
      }
      this.updateList()
      
    },
    async updateList(){
      let body = await this.$http.contact.getContactList()
      if(body.data.code === OK)
          this.list = body.data.data
      }
    },
    mounted(){
      this.updateList()
    }
}
</script>


<style>
  
</style>