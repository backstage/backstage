import{T as P}from"./TablePagination-Dht1KX0m.js";import"./iframe-hQz1Bovf.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BZ987qtB.js";import"./index-FWFS6Ht_.js";import"./Select-c4OzTjkG.js";import"./Button-Ch3RVnjq.js";import"./utils-Pry2iZeD.js";import"./Label-B5koVi8k.js";import"./Hidden-BqzmQXOc.js";import"./useFocusRing-C3OD7nib.js";import"./openLink-B-dyxHNl.js";import"./useLabel-BRsF9iG_.js";import"./useLabels-ZBMKhu5T.js";import"./number-B-GEUIkl.js";import"./I18nProvider-a0qIHqSM.js";import"./useButton-DYFFtKSn.js";import"./usePress-CccSWJzt.js";import"./textSelection-Cp_gZcRW.js";import"./useHover-DMQGs42H.js";import"./FieldError-BZqCFV-T.js";import"./Text-CECxUU9A.js";import"./useFormValidation-gBSJNCGj.js";import"./ListBox-wpLVGfiI.js";import"./useCollection-Cb7abx-d.js";import"./keyboard-he29tEj5.js";import"./FocusScope-CecXE6Ry.js";import"./useEvent--KmV8xmg.js";import"./useControlledState--W8dIr0F.js";import"./getItemCount-C-khq3P_.js";import"./Autocomplete-BGy9sauS.js";import"./useLocalizedStringFormatter-DjKxePN-.js";import"./useListState-Dyr1nGEJ.js";import"./Dialog-ebcM6ZI2.js";import"./Heading-DCLutLrl.js";import"./useOverlayTriggerState-BrKZac3u.js";import"./VisuallyHidden-BJA4xb02.js";import"./animation-6avlbPLD.js";import"./useField-DD1vcu_y.js";import"./useFormReset-BEXxxxDO.js";import"./Input-CW3dRuCG.js";import"./SearchField-DNoqW-Ap.js";import"./useTextField-C8_4ZoZz.js";import"./useFilter-CLUYuBNu.js";import"./useCollectionAdapter-De5xVL1q.js";import"./Avatar-C-npZQAt.js";import"./Skeleton-CGYf2PXw.js";import"./FieldLabel-1n_FXtdc.js";import"./FieldError-DffjU23W.js";import"./Popover-D7uhdJMW.js";import"./Text-DdWU9-lb.js";import"./ButtonIcon-v_Pm-dsq.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
