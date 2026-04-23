import{T as P}from"./TablePagination-BMdS1P5o.js";import"./iframe-izSSIzTR.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DA7QflCc.js";import"./index-DGFCpqz_.js";import"./Select-D1HLj3Pf.js";import"./Dialog-0jMX3lLJ.js";import"./Button-CxBdRGKu.js";import"./utils-Cl9gINrl.js";import"./Label-DiQKndYJ.js";import"./Hidden-Z1-_rzje.js";import"./useGlobalListeners-CynQJlR4.js";import"./openLink-BZ37FDEF.js";import"./useLabel-C1C1CBQ9.js";import"./useLabels-DlA16iH6.js";import"./number-CfXc65k1.js";import"./I18nProvider-Dt5oCbl9.js";import"./useButton-cd_LBPNR.js";import"./usePress-BYzppgbW.js";import"./textSelection-DP5PjHic.js";import"./useHover-Dn05tM4n.js";import"./Heading-DYvyXDrA.js";import"./useOverlayTriggerState-b9H8BJqN.js";import"./useControlledState-Bla-K4z3.js";import"./useCollection-DuuVA1d_.js";import"./keyboard-PuRhgdyi.js";import"./FocusScope-C430Nj-p.js";import"./useEvent-C6O8PQe-.js";import"./Autocomplete-CUty0TUf.js";import"./useLocalizedStringFormatter-CbcXejhq.js";import"./getItemCount-CRf65XBI.js";import"./Text-B7PTVtbA.js";import"./VisuallyHidden-g7Ve-a9e.js";import"./animation-CuZPc9sJ.js";import"./FieldError-bPDpl4tm.js";import"./useFormValidation-KKy4svAa.js";import"./ListBox-DB9taT5i.js";import"./useListState-DmOJF73R.js";import"./useField-Ds3mC8xn.js";import"./useFormReset-BRuBz3cs.js";import"./definition-CkLKpoaa.js";import"./Input-DB8OS-O0.js";import"./SearchField-C-1h_s6-.js";import"./useTextField-D2DQSV74.js";import"./useFilter-HT3pDS3J.js";import"./FieldLabel-F6-7fl6A.js";import"./FieldError-ehaVnJGD.js";import"./Text-DdqvwTvZ.js";import"./ButtonIcon-BYMJLASR.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
