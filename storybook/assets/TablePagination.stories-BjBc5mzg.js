import{T as P}from"./TablePagination-DR6o7dxu.js";import"./iframe-CHEWuc0v.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DKAsx6hW.js";import"./index-B62jAG7L.js";import"./Select-CteYZn_I.js";import"./Dialog-CIsJi4D-.js";import"./Button-B9vlA_aD.js";import"./utils-BxEscNNs.js";import"./Label-DQqpprKD.js";import"./Hidden-CAexRByi.js";import"./useFocusRing-1zG72QMw.js";import"./openLink-BiHhgp--.js";import"./useLabel-B58lRzKY.js";import"./useLabels-Bv_lSVf9.js";import"./number-DKxN-QGX.js";import"./I18nProvider-UVXl-yfe.js";import"./useButton-CzFa8UCY.js";import"./usePress-CJDBJtKl.js";import"./textSelection-CbIkyffu.js";import"./useHover-00AgdYZB.js";import"./Heading-CgrjVi2W.js";import"./useOverlayTriggerState-CU3RRWZ1.js";import"./useControlledState-CNV1iaRe.js";import"./useCollection-BVoRuWAX.js";import"./keyboard-4NRJcueD.js";import"./FocusScope-7GJqqO46.js";import"./useEvent-B8pMzZDs.js";import"./Autocomplete-ELpe6TRS.js";import"./useLocalizedStringFormatter-BkATKUa_.js";import"./getItemCount-DP1fYVrp.js";import"./Text-DScPCt4K.js";import"./VisuallyHidden-CL5Oi_Ph.js";import"./animation-Dd88U9fr.js";import"./FieldError-BeS7cYV1.js";import"./useFormValidation-Cxqe4FSt.js";import"./ListBox-DYXnz5bK.js";import"./useListState-mbD-HD4h.js";import"./useField-BNKDi1A0.js";import"./useFormReset-D0DN1vi5.js";import"./definition-CAjTXOCn.js";import"./Input-x_Yp9vW1.js";import"./SearchField-2iByw2dq.js";import"./useTextField-COfODcd5.js";import"./useFilter-BxE8phSZ.js";import"./FieldLabel-BIOOupRU.js";import"./FieldError-OB0ZLjnP.js";import"./Text-CcM-dHDt.js";import"./ButtonIcon-oA_YLce1.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
