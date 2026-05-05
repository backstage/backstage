import{T as P}from"./TablePagination-CSrbxXtv.js";import"./iframe-D7zjeBit.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DBuc4hsG.js";import"./index-LDISzqXk.js";import"./Select-D8w5xkiW.js";import"./Dialog-BtZ5HaM4.js";import"./Button-BkfAp3Z3.js";import"./utils-DT1TjeCF.js";import"./Label-BmMPPwxv.js";import"./Hidden-eUWrODR3.js";import"./useFocusRing-CcaS568W.js";import"./openLink-Cd2W8V43.js";import"./useLabel-Dzvjg_te.js";import"./useLabels-DF4WD905.js";import"./number-Ak6nl69k.js";import"./I18nProvider-Bqk7J9JQ.js";import"./useButton-gGgWVRko.js";import"./usePress-i7SGd9UH.js";import"./textSelection-D1LrsWTO.js";import"./useHover-CAFK-SRk.js";import"./Heading-CIWAhiRd.js";import"./useOverlayTriggerState-uz4WJey4.js";import"./useControlledState-B97kHxGJ.js";import"./useCollection-hubZB73P.js";import"./keyboard-CxRj-QkP.js";import"./FocusScope-BaV0NQba.js";import"./useEvent-D_rPYO66.js";import"./Autocomplete-BzMQjmnY.js";import"./useLocalizedStringFormatter-Cz5NmZgr.js";import"./getItemCount-BtqcCU3Q.js";import"./Text-Cj3ktV05.js";import"./VisuallyHidden-Dye_pBME.js";import"./animation-FtYkuHMN.js";import"./FieldError-DKsDpV1u.js";import"./useFormValidation-BZnA9AHx.js";import"./ListBox-2wm_5SBv.js";import"./useListState-ncC1YF1e.js";import"./useField-tHYRkqMm.js";import"./useFormReset-CWyOK-4w.js";import"./definition-85X8BPnd.js";import"./Input-HiwRmiDu.js";import"./SearchField-CcS0dm25.js";import"./useTextField-CXnvxD3U.js";import"./useFilter-BR5SumJW.js";import"./FieldLabel-C2Lz-Ku3.js";import"./FieldError-Ck75auWg.js";import"./Text-Cp7xeFen.js";import"./ButtonIcon-DCQpvRjy.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
