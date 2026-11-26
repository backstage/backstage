import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-bb_jNxxL.js";import{T as y}from"./TestRouter-CbDFQ_sS.js";import{P as l}from"./PluginHeader-Cm0skTPz.js";import{C as p}from"./Container-_TcIzaM2.js";import{T as t}from"./Text-BseoxH0X.js";import{B as j}from"./BUIProvider-3fANo4od.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B6EXqJ8A.js";import"./index-gvfFGbLs.js";import"./utils-Cyge8L4m.js";import"./useObjectRef-CTDjzFB8.js";import"./useCollection-DV0iE3Tb.js";import"./useFocusRing-DDqjVrJn.js";import"./Hidden-7ff-isZb.js";import"./keyboard-CTRGf6zG.js";import"./getMetaValue-BAPq9Qsv.js";import"./FocusScope-H3a-3FIW.js";import"./useEvent-CLir4Cc2.js";import"./I18nProvider-B9G7Dj3y.js";import"./usePress-iPbewX15.js";import"./textSelection-DLp-xbkE.js";import"./useControlledState-B45Nf08u.js";import"./Link-Bn2yFlaz.js";import"./useLink-Cw4nOyzC.js";import"./useHover-dfqWQZHs.js";import"./useLocalizedStringFormatter-Db8iDqbo.js";import"./Button-B0WaVeZf.js";import"./Label-C64Zc2HQ.js";import"./useLabel-DvDKUI6U.js";import"./useLabels-B5_kFWwx.js";import"./number-DwC5Q0g4.js";import"./useButton-Dgm20RBw.js";import"./Menu-CJcjGEiz.js";import"./Autocomplete-DbeBzPgx.js";import"./useLoadMoreSentinel-C2DRsS6z.js";import"./Input-Dr54Is2P.js";import"./ListBox-16vWbqAu.js";import"./SelectionIndicator-BvbLcwFj.js";import"./Text-BtpIt2qG.js";import"./useListState-DG0_AzeR.js";import"./Dialog-CshjZfCk.js";import"./Heading-DqjAjdHh.js";import"./useOverlayTriggerState-Cwdw0na1.js";import"./VisuallyHidden-V0bjBViI.js";import"./animation-BLiFJPlN.js";import"./SearchField-C4sv5qiQ.js";import"./FieldError-CzTxz--v.js";import"./Form-C58QXp5W.js";import"./useFormValidation-CWqstwdw.js";import"./useTextField-CI0DqPWz.js";import"./useField-BGbko4b6.js";import"./useFormReset-Dv4_zW6V.js";import"./Virtualizer-DMR2YKbK.js";import"./useFilter-BEmfJ5SZ.js";import"./getNodeText-XEz2Kd1g.js";import"./BUIRoutingProvider-DqHM2OTt.js";import"./Link-CqA1DZlI.js";import"./Tooltip-BiZdYZQM.js";import"./VisuallyHidden-BNKTl-Ou.js";import"./Tabs-HhcKyfYT.js";import"./useHasTabbableChild-aiZ5SoGg.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const qe=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,qe as __namedExportsOrder};
