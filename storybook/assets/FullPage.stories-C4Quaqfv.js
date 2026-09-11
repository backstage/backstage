import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-JPiukB_R.js";import{P as l}from"./PluginHeader-Dtm8v2-X.js";import{C as p}from"./Container-CgSeA4vj.js";import{T as t}from"./Text-D0uRsaTu.js";import{B as j}from"./BUIProvider-DNlcrhsv.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DFKLNzc2.js";import"./utils-DDi5xxmN.js";import"./useObjectRef-DXVQTGA8.js";import"./useCollection-DIbzle1l.js";import"./useFocusRing-DaX8_kMK.js";import"./openLink-0QZlDlxj.js";import"./Hidden-B-d7XQtl.js";import"./keyboard-DE38zrnp.js";import"./FocusScope-9aUIRnvL.js";import"./useEvent-BnHE3X8m.js";import"./I18nProvider-DFp_bXrB.js";import"./usePress-BL8d4Qht.js";import"./textSelection-DFCD4j4A.js";import"./useControlledState-BQx1jdRH.js";import"./Link-DJZ4jes6.js";import"./useLink-B6ImV0Rp.js";import"./useHover-BNLW-94k.js";import"./useLocalizedStringFormatter-CtZkUal3.js";import"./Button-DEJ5jMKU.js";import"./Label-IokeRjbO.js";import"./useLabel-D_mWupuI.js";import"./useLabels-NEKiuqWd.js";import"./number-G04hMwQn.js";import"./useButton-CuUkU0tZ.js";import"./Menu-ly0y09T1.js";import"./Autocomplete-0FuprScb.js";import"./getItemCount-DBXp33SO.js";import"./Input-zgYq2BzY.js";import"./ListBox-VVkgYUYK.js";import"./Text-D1sILF3o.js";import"./useListState-kRwx-MKu.js";import"./Dialog-DRcxXFrw.js";import"./Heading-CTTW_TQO.js";import"./useOverlayTriggerState-D8Agx5ZP.js";import"./VisuallyHidden-Cwyoj3Cn.js";import"./animation-0YAkd_Wy.js";import"./SearchField-BCCWFtk1.js";import"./FieldError-CIAC_u_D.js";import"./useFormValidation-DY4ZlP36.js";import"./useTextField-DnRlJLXB.js";import"./useField-UvHv0-tI.js";import"./useFormReset-BZnw3Fbe.js";import"./Virtualizer-C4FuZeqy.js";import"./useFilter-BEAT9qGP.js";import"./getNodeText-BLF9uQ0j.js";import"./Link-D6VxF2xE.js";import"./useResolvedHref--qUd8mWw.js";import"./Tooltip-DAMzI_jU.js";import"./VisuallyHidden-DO6MZ5Ka.js";import"./Tabs-B3cpFN6K.js";import"./useHasTabbableChild-Bq1Q9Vct.js";import"./BUIRoutingProvider-BiCU-bXq.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
