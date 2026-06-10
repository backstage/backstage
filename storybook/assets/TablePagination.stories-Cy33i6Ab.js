import{T as P}from"./TablePagination-CYBehBXd.js";import"./iframe-C0kJxuo3.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BSMvvO9T.js";import"./index-Coy0BsT2.js";import"./Select-DZJVc9sT.js";import"./Dialog-aj67Y2P6.js";import"./Button-0xD_iNZ8.js";import"./utils-CnFsvhU-.js";import"./Label-CdCEFadA.js";import"./Hidden-CHyqgnK5.js";import"./useFocusRing-Bg7HxPV-.js";import"./openLink-DDhi7ntb.js";import"./useLabel-DNf3_Lp_.js";import"./useLabels-4ReBYVqS.js";import"./number-Dmbrky01.js";import"./I18nProvider-CQJu78Ur.js";import"./useButton-C5_iIfVg.js";import"./usePress-D6IwwG3Z.js";import"./textSelection-CBV5UGO_.js";import"./useHover-D7zQG8_9.js";import"./Heading-C3ekKbn_.js";import"./useOverlayTriggerState-DNfzgjNB.js";import"./useControlledState-DQVnvmLX.js";import"./useCollection-DfuSg4vH.js";import"./keyboard-BnyidUqB.js";import"./FocusScope-787iYxHM.js";import"./useEvent-DBd9MG6t.js";import"./Autocomplete-DeDZ3wSY.js";import"./useLocalizedStringFormatter-CaA0b4kd.js";import"./getItemCount-s1EPoKYf.js";import"./Text-Ct_pvziQ.js";import"./VisuallyHidden-B3qXyhFS.js";import"./animation-BE1K-jNr.js";import"./FieldError--FqYVBj6.js";import"./useFormValidation-3aKGROn2.js";import"./ListBox-DBzdgmOG.js";import"./useListState-BDTgDPEL.js";import"./useField-BpTsyISE.js";import"./useFormReset-C1xWZBqw.js";import"./definition-DKxva3wU.js";import"./Input-B_FaaR_5.js";import"./SearchField-BajbnPLQ.js";import"./useTextField-DIqeoBkH.js";import"./useFilter-DDvz2G1_.js";import"./FieldLabel-BCoc0pgd.js";import"./FieldError-tphVtU6h.js";import"./Text-BuUWsI-Z.js";import"./ButtonIcon-z2V1bzmo.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
