import{T as P}from"./TablePagination-BZPwEhyw.js";import"./iframe-ePBrCY0J.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CclugPMZ.js";import"./index-DdPr1LgH.js";import"./Select-bvnG_309.js";import"./Dialog-Ojbf-T66.js";import"./Button-DpC2nIQu.js";import"./utils-GBijbolr.js";import"./Label-1Kx-PSOk.js";import"./Hidden-B2rvrS5M.js";import"./useGlobalListeners-C1Wz4BBp.js";import"./openLink-DeVepgBP.js";import"./useLabel-TFQcYu-7.js";import"./useLabels-B4Vxdzxx.js";import"./number-D6eg_I8y.js";import"./I18nProvider-R5Bgm47i.js";import"./useButton-DpfFNltK.js";import"./usePress-B1R1wuUB.js";import"./textSelection-DJeCcLJx.js";import"./useHover-DSqx_ATM.js";import"./Heading-C0l2_lyj.js";import"./useOverlayTriggerState-mFiWs9vM.js";import"./useControlledState-CQHZuYfK.js";import"./useCollection-CXdtF9C_.js";import"./keyboard-BIot6J6b.js";import"./FocusScope-CkkbOXOn.js";import"./useEvent-FGignhdM.js";import"./Autocomplete-QHumKYq_.js";import"./useLocalizedStringFormatter-oJ_OSv4u.js";import"./getItemCount-C5TKpKrp.js";import"./Text-C6_aqZ0v.js";import"./VisuallyHidden-Cz9gSX0B.js";import"./animation-CuzbkGKI.js";import"./FieldError-5XilZbEY.js";import"./useFormValidation-CyPPV_21.js";import"./ListBox-DWvGY10Q.js";import"./useListState-ClyFUasw.js";import"./useField-Dr-FKh4K.js";import"./useFormReset-Bkitr4zB.js";import"./definition-D2EHSPIT.js";import"./useTextField-DPqwEKMK.js";import"./SearchField-BiEhGjSX.js";import"./useFilter-aKUq3SN_.js";import"./FieldLabel-Bus4OTuu.js";import"./FieldError-BAbpA5-1.js";import"./Text-DvJmp2FU.js";import"./ButtonIcon-BZ5deRJC.js";const p=()=>{},ge={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const me=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,me as __namedExportsOrder,ge as default};
