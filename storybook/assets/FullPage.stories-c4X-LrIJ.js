import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-S5OJNhaE.js";import{P as l}from"./PluginHeader-rYRJ-zqh.js";import{C as p}from"./Container-DfGbUuUj.js";import{T as t}from"./Text-bGH6hxSc.js";import{B as j}from"./BUIProvider-CxyEA8gh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BC5M37nw.js";import"./utils-Bf43CEqe.js";import"./useObjectRef-Ce7Pg0IE.js";import"./useCollection-k8pWz5ND.js";import"./useFocusRing-DrNn4w0v.js";import"./openLink-gCGEI6Hl.js";import"./Hidden-bbdHFmyf.js";import"./keyboard-DsBCMzZY.js";import"./getMetaValue-DfvZTkcg.js";import"./FocusScope-C1MKzIWs.js";import"./useEvent-BTfti7hW.js";import"./I18nProvider-B9PKsfTQ.js";import"./usePress-BKUcGSaX.js";import"./textSelection-C5XFxsbn.js";import"./useControlledState-sjWVeRbh.js";import"./Link-CxsqMtTe.js";import"./useLink-D_YD4HGA.js";import"./useHover-DRBklp1Y.js";import"./useLocalizedStringFormatter-FCJD34ts.js";import"./Button-C2Hm-9-t.js";import"./Label-Dm19jsZB.js";import"./useLabel-D6KUrPXz.js";import"./useLabels-lt4DDiFl.js";import"./number-DPETitzY.js";import"./useButton-ZsuQVD8S.js";import"./Menu-CCBUh7j9.js";import"./Autocomplete-D8VeH8Ib.js";import"./useLoadMoreSentinel-BFnt0SFw.js";import"./Input-eHTkKayp.js";import"./ListBox-3Aeqh9PT.js";import"./SelectionIndicator-CRRCNCtd.js";import"./Text-CxFSOtlL.js";import"./useListState-CXSz469O.js";import"./Dialog-BiUzqtUJ.js";import"./Heading-C94RofTM.js";import"./useOverlayTriggerState-C-PPUK0B.js";import"./VisuallyHidden-DVzk229T.js";import"./animation-D5KQd_1z.js";import"./SearchField-meulwOzD.js";import"./FieldError-B0-R75VP.js";import"./Form-CdsOyD6B.js";import"./useFormValidation-CHoAG3iu.js";import"./useTextField-XvGvtHKV.js";import"./useField-C9JYPx-z.js";import"./useFormReset-CTFIfjuR.js";import"./Virtualizer-F-4qcxjn.js";import"./useFilter-7KI-EPr5.js";import"./getNodeText-opGXgiNZ.js";import"./Link-BAwAEzDG.js";import"./useResolvedHref-D6pj4Xy7.js";import"./Tooltip-CkWomL7j.js";import"./VisuallyHidden-BIXQeZE2.js";import"./Tabs-Q10-7RiX.js";import"./useHasTabbableChild-DWlYfx72.js";import"./BUIRoutingProvider-MbdU_jc-.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
