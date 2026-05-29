import{T as P}from"./TablePagination-x9sAglgT.js";import"./iframe-t54gLFa0.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C3DVLawX.js";import"./index-BaJeNOvl.js";import"./Select-C2wXIPYC.js";import"./Dialog-a3-nibQ5.js";import"./Button-DoFptNA9.js";import"./utils-W_OcwHCh.js";import"./Label-BScIi9Kg.js";import"./Hidden-Bp4y3_la.js";import"./useFocusRing-V0WlKBhU.js";import"./openLink-BrZmZSwy.js";import"./useLabel-B4TkV3uy.js";import"./useLabels-Cl1AF1fl.js";import"./number-ixZOtUbe.js";import"./I18nProvider-D1Ub29LP.js";import"./useButton-Dm8iXsCh.js";import"./usePress-KWITTjJL.js";import"./textSelection-BWh9bKC1.js";import"./useHover-DSCE7LE-.js";import"./Heading-Coxp95_V.js";import"./useOverlayTriggerState-mmQoPNRj.js";import"./useControlledState-3Cl2ojEk.js";import"./useCollection-BMtoKWDH.js";import"./keyboard-RHFCgLFL.js";import"./FocusScope-_KNx_SOQ.js";import"./useEvent-B2ORR698.js";import"./Autocomplete-P1PFt3qE.js";import"./useLocalizedStringFormatter-DQu-DAui.js";import"./getItemCount-Di_kFt9Q.js";import"./Text-43fvPt9T.js";import"./VisuallyHidden-CbVh8SMY.js";import"./animation-BW8uo9FK.js";import"./FieldError-N1cuoUOh.js";import"./useFormValidation-t-xGAaZ7.js";import"./ListBox-BR4cAU32.js";import"./useListState-AUForFeb.js";import"./useField-BxTVInbI.js";import"./useFormReset-CukaQ-Is.js";import"./definition-BS-Gr8Ve.js";import"./Input-JiKeBEm0.js";import"./SearchField-DZz6bbT8.js";import"./useTextField-BWoBi-F7.js";import"./useFilter-DSm_QDTI.js";import"./FieldLabel-CiSTb_vd.js";import"./FieldError-BpFGbwfs.js";import"./Text-DUZhQt0L.js";import"./ButtonIcon-l9-cP-G0.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
