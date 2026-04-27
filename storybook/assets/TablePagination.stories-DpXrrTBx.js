import{T as P}from"./TablePagination-DraosR8b.js";import"./iframe-BOELprFv.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DxkXclDP.js";import"./index-B6vtisdo.js";import"./Select-D1myVc8W.js";import"./Dialog-DRSKJO83.js";import"./Button-mgifbgKi.js";import"./utils-CMfP5a9J.js";import"./Label-De-gsAC-.js";import"./Hidden-CIUjISy6.js";import"./useGlobalListeners-Dwin9QbU.js";import"./openLink-OWDAQw2O.js";import"./useLabel-Bq-zls4u.js";import"./useLabels-VhtBpse3.js";import"./number-DngxYKCS.js";import"./I18nProvider-B5mI5xOx.js";import"./useButton-D3eUffk2.js";import"./usePress-D6nesoi-.js";import"./textSelection-CAJnYtxl.js";import"./useHover-rD6pSZqo.js";import"./Heading-CVeHGN7F.js";import"./useOverlayTriggerState-C8xuiajh.js";import"./useControlledState-4LqVtm1l.js";import"./useCollection-CWVSYuF8.js";import"./keyboard-BEUKpvVb.js";import"./FocusScope-DCXW42YV.js";import"./useEvent-DmWKKIhl.js";import"./Autocomplete-CttmfgW8.js";import"./useLocalizedStringFormatter-Dr-TpJpK.js";import"./getItemCount-BwB88FRB.js";import"./Text-1jTbNMOq.js";import"./VisuallyHidden-D8U_uoLi.js";import"./animation-BchYasUt.js";import"./FieldError-UPtD9qTm.js";import"./useFormValidation-C1kFvvb4.js";import"./ListBox-OXN7NZxf.js";import"./useListState-DVt0df0J.js";import"./useField-DCxYgzN5.js";import"./useFormReset-B_FQUy9d.js";import"./definition-DhbL7Lai.js";import"./Input-B4P64nxn.js";import"./SearchField-BSy3HEmI.js";import"./useTextField-BgMpbc7n.js";import"./useFilter-DnqRYrdF.js";import"./FieldLabel-Citsgfed.js";import"./FieldError-B5KKLUZ2.js";import"./Text-mFKlGNXF.js";import"./ButtonIcon-CHN_c-eU.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
