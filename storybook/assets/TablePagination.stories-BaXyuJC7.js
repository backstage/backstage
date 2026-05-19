import{T as P}from"./TablePagination-Dt5PNrZq.js";import"./iframe-BCuiGO18.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-4ckOICrI.js";import"./index-CZoZdV61.js";import"./Select-Bmw23Vrz.js";import"./Dialog-BVA8Etyl.js";import"./Button-D45nAvky.js";import"./utils-Dk-My0Vp.js";import"./Label-CP3Gf_jA.js";import"./Hidden-CQxh535z.js";import"./useFocusRing-DLmUbRy9.js";import"./openLink-qumaaci0.js";import"./useLabel-Cghjfl30.js";import"./useLabels-DNIhmQLC.js";import"./number-K2-BhP7Z.js";import"./I18nProvider-PVYTewA5.js";import"./useButton-wJ1TOWtu.js";import"./usePress-BvVw0-yf.js";import"./textSelection-B2Nn6fLe.js";import"./useHover-DAnXmX41.js";import"./Heading-p3ccHffT.js";import"./useOverlayTriggerState-FMs9pAOe.js";import"./useControlledState-BCKq2N8L.js";import"./useCollection-BFYgTRUF.js";import"./keyboard-CW4oFFyD.js";import"./FocusScope-C9frp5S3.js";import"./useEvent-4on_clb_.js";import"./Autocomplete-CblQiv1-.js";import"./useLocalizedStringFormatter-DYH9mEAL.js";import"./getItemCount-V0Dhj5LC.js";import"./Text-D_YSa9DZ.js";import"./VisuallyHidden-D8FM7PxL.js";import"./animation-G_BOhArD.js";import"./FieldError-BHS-ts2M.js";import"./useFormValidation-DDQUNMCB.js";import"./ListBox-CdC0FzRK.js";import"./useListState-CxjrO4Uy.js";import"./useField-XKRN51sf.js";import"./useFormReset-C5fpnI1D.js";import"./definition-CpmdpZG4.js";import"./Input-YrcqhNjP.js";import"./SearchField-CgRHBJcu.js";import"./useTextField-D88sn5Bj.js";import"./useFilter-mXUQlKFC.js";import"./FieldLabel-skXYA8du.js";import"./FieldError-ALlgHKsB.js";import"./Text-DMbKVHIB.js";import"./ButtonIcon-VFIrmix7.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
