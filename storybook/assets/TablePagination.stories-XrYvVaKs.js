import{T as P}from"./TablePagination-Bw4FGh49.js";import"./iframe-COJz9F1o.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BVWhO1QJ.js";import"./index-C7YuSWIQ.js";import"./Select-DdrZUYO3.js";import"./Dialog-DFM5S7cL.js";import"./Button-D6Mw4SOw.js";import"./utils-Ca8VRlnk.js";import"./Label-Bje3-SKc.js";import"./Hidden-BUcIqtcd.js";import"./useGlobalListeners-B-mHHtEE.js";import"./openLink-D-7XJ3Oc.js";import"./useLabel-CzB85gF3.js";import"./useLabels-DX3CMU8G.js";import"./number-DOpROmP3.js";import"./I18nProvider-Cix8lVYp.js";import"./useButton-BjPKXG4Y.js";import"./usePress-DKjqoiSZ.js";import"./textSelection-B1xIHbhq.js";import"./useHover-d8OYsWaB.js";import"./Heading-C5WiFkYc.js";import"./useOverlayTriggerState-D6IJfzW1.js";import"./useControlledState-CYGiTDAh.js";import"./useCollection-BOqwRVgc.js";import"./keyboard-DtR6oH2F.js";import"./FocusScope-hw_VMdoM.js";import"./useEvent-ptp_askm.js";import"./Autocomplete-BXjco31v.js";import"./useLocalizedStringFormatter-Uk8SorkE.js";import"./getItemCount-Cf5ynn4r.js";import"./Text-Dur_mw8s.js";import"./VisuallyHidden-D8GUlp6B.js";import"./animation-Chfeuq0j.js";import"./FieldError-DZi-Bg3f.js";import"./useFormValidation-76zPVQeq.js";import"./ListBox-6m2MzSCF.js";import"./useListState-Dq_Xc-F9.js";import"./useField-BrLSuq_4.js";import"./useFormReset-DtFtm4js.js";import"./definition-BZTqucgV.js";import"./Input-LTSQ7X0M.js";import"./SearchField-ICojnzda.js";import"./useTextField-BnkFLiJE.js";import"./useFilter-DuiLTnz7.js";import"./FieldLabel-BL0QMILD.js";import"./FieldError-CtICZLBA.js";import"./Text-B-mK5mWm.js";import"./ButtonIcon-tKB0SKuF.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
