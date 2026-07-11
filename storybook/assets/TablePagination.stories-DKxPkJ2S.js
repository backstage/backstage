import{T as P}from"./TablePagination-D-s-Ax0m.js";import"./iframe-COykYx45.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CMiC6ke_.js";import"./index-C2j_KLnZ.js";import"./Select-C2EVI7Ft.js";import"./Button-Bito0oFe.js";import"./utils-ijm_b3mJ.js";import"./Label--YQs_5DF.js";import"./Hidden-BsQlbI9F.js";import"./useFocusRing-Bjvn0GS4.js";import"./openLink-DVwmAOKC.js";import"./useLabel-PGKREU8T.js";import"./useLabels-Cpdv89rG.js";import"./number-B3izyAdU.js";import"./I18nProvider-DL1Ps6Ca.js";import"./useButton-rnhRQmzJ.js";import"./usePress-C3UrLlH7.js";import"./textSelection-BToKgSXC.js";import"./useHover-gDb7vOkJ.js";import"./FieldError-BP5SOq7I.js";import"./Text-slD25mVU.js";import"./useFormValidation-DaDBy4-y.js";import"./ListBox-DM8wv16H.js";import"./useCollection-CdVfx8jU.js";import"./keyboard-C7oGs8Ux.js";import"./FocusScope-4bHQ4WF-.js";import"./useEvent-Dn5dWHRg.js";import"./useControlledState-CjsdyDjY.js";import"./getItemCount-BTil1_1B.js";import"./Autocomplete-BCll0Usm.js";import"./useLocalizedStringFormatter-BGJNBy6y.js";import"./useListState-CZzGAJgT.js";import"./Dialog-DuxVYgUJ.js";import"./Heading-CjfE-IUi.js";import"./useOverlayTriggerState-BkDz7Lrc.js";import"./VisuallyHidden-OeS3fhJT.js";import"./animation-By8SMLky.js";import"./useField-Capgz0XH.js";import"./useFormReset-DHQFUW9B.js";import"./Input-ye45j2AX.js";import"./SearchField-CU8pFK3h.js";import"./useTextField-afr60wi8.js";import"./useFilter-CW83bmhz.js";import"./useCollectionAdapter-D0-qm-R2.js";import"./Avatar-C4FbvhT4.js";import"./Skeleton-DR372PC3.js";import"./FieldLabel-D0qHGXY9.js";import"./FieldError-BKd5KLE1.js";import"./Popover-vvfnKrWo.js";import"./Text-Cyy7dPnV.js";import"./ButtonIcon-DD_AnQDN.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
