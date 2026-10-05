import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-CbQECOPA.js";import{P as l}from"./PluginHeader-BnaomZNB.js";import{C as p}from"./Container-Bwh6xZz2.js";import{T as t}from"./Text-Y4w9it8L.js";import{B as j}from"./BUIProvider-Dfgte2IK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CVJ_DY1z.js";import"./utils-BjKqyDUC.js";import"./useObjectRef-rAZvTeo9.js";import"./useCollection-DIi-vDTy.js";import"./useFocusRing-BprGfwbh.js";import"./openLink-CkgyiaKP.js";import"./Hidden-Cie_Gmgv.js";import"./keyboard-BiB554EB.js";import"./FocusScope-CfCaPDEx.js";import"./useEvent-DYgfpRDF.js";import"./I18nProvider-X_rloAM9.js";import"./usePress-C80y_bid.js";import"./textSelection-CTwx7Hd8.js";import"./useControlledState-BYBhhx6m.js";import"./Link-BVySSxAJ.js";import"./useLink-BT7PeoYl.js";import"./useHover-C0zeuS3S.js";import"./useLocalizedStringFormatter-B4KkAVMn.js";import"./Button-CqUujd7S.js";import"./Label-CmorgM_W.js";import"./useLabel-BlUgJ3a0.js";import"./useLabels-Hmk_0Efx.js";import"./number-CbNxdcRk.js";import"./useButton-hc7LOMzh.js";import"./Menu-CodkvJgw.js";import"./Autocomplete-BNai4oWa.js";import"./getItemCount-B_r3Vxwo.js";import"./Input-CjJ1M9tR.js";import"./ListBox-DyOFqIrC.js";import"./Text-DTo7MTvL.js";import"./useListState-NojfAC-Q.js";import"./Dialog-B9J-z4RW.js";import"./Heading-t8vg85oi.js";import"./useOverlayTriggerState-CU1gdxD5.js";import"./VisuallyHidden-N7kQo01U.js";import"./animation-LCLQa1wT.js";import"./SearchField-CIp1uFk3.js";import"./FieldError-CYK7f2yb.js";import"./useFormValidation-CKGiJz9e.js";import"./useTextField-DyaWxWWJ.js";import"./useField-Bwd8Jmt6.js";import"./useFormReset-BJvTatsh.js";import"./Virtualizer-BBJQmG25.js";import"./useFilter-B9gIhNbK.js";import"./getNodeText-jlnv9tZE.js";import"./Link-CTqCaWhD.js";import"./useResolvedHref-C62JVAS9.js";import"./Tooltip-D0iixQsi.js";import"./VisuallyHidden-UdkYIXiV.js";import"./Tabs-CQwpl2FQ.js";import"./useHasTabbableChild-DyGoT_yp.js";import"./BUIRoutingProvider-C-P7g4SH.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,Se as __namedExportsOrder};
