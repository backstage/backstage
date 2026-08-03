import{T as P}from"./TablePagination-bW2XC8rO.js";import"./iframe-Bep9_wBM.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BMeF5lvf.js";import"./index-tx8xlZoJ.js";import"./Select-C-2QydIW.js";import"./Button-C3UUENf1.js";import"./utils-DKKUPgM-.js";import"./Label-CXp4l2Zb.js";import"./Hidden-oYhCQ5Lr.js";import"./useFocusRing-E1AuPNx9.js";import"./openLink-DRfzd4-2.js";import"./useLabel-BiWRb2jR.js";import"./useLabels-BH6rqbM3.js";import"./number-VxDrHCY-.js";import"./I18nProvider-7dRPeGho.js";import"./useButton-0kbhVXvj.js";import"./usePress-vAS4agaY.js";import"./textSelection-DySWx5du.js";import"./useHover-DE1qWbCW.js";import"./FieldError-PsYucoOR.js";import"./Text-BGZzKR-G.js";import"./useFormValidation-DQVcjs21.js";import"./ListBox-BBE0Hsl8.js";import"./useCollection-BavV2Nde.js";import"./keyboard-CUlyN15g.js";import"./FocusScope-C_MYe5zM.js";import"./useEvent-67yxp7d3.js";import"./useControlledState-B2mYurZ2.js";import"./getItemCount-_QZQZcAU.js";import"./Autocomplete-BXs_0ks3.js";import"./useLocalizedStringFormatter-mkayHLXh.js";import"./useListState-CE3Qd9aw.js";import"./Dialog-CyckqERW.js";import"./Heading-Bgxo1Fus.js";import"./useOverlayTriggerState-Bb7OtJVc.js";import"./VisuallyHidden-DgCl88eH.js";import"./animation-DqvQk7gj.js";import"./useField-pYHkB-lT.js";import"./useFormReset-mbGsMuFn.js";import"./Input-DNjM_x5h.js";import"./SearchField-DfeDRkpE.js";import"./useTextField-CaarGrBO.js";import"./useFilter-C7NlaC5C.js";import"./useCollectionAdapter-DW-i5jeO.js";import"./Avatar-8hLd4Nq_.js";import"./Skeleton-C_hbHLdG.js";import"./FieldLabel-CH0zAiGv.js";import"./FieldError-AMQvzmZ6.js";import"./Popover-DzJFjeHa.js";import"./Text-BofD9AVk.js";import"./ButtonIcon-D8UVM1JY.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Pe=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,Pe as __namedExportsOrder,le as default};
