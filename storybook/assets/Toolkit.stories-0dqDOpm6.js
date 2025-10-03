import{j as o}from"./iframe-QBX5Mcuo.js";import{c as e}from"./plugin-DLAShKum.js";import{S as l}from"./Grid-Q_BfCJNG.js";import{C as m}from"./ComponentAccordion-CxVbvU_I.js";import{w as a}from"./appWrappers-357IU-cP.js";import{T as i}from"./TemplateBackstageLogoIcon-BD7Keupn.js";import{I as s}from"./InfoCard-DyGnoqeb.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BpVAfwk3.js";import"./componentData-DHgvWv9V.js";import"./useAnalytics-Pg_QG9Iq.js";import"./useApp-B1pSEwwD.js";import"./useRouteRef-Bc19hZiH.js";import"./index-CDF8GVFg.js";import"./DialogTitle-BSYcyeQj.js";import"./Modal-B7uRaYS1.js";import"./Portal-D97HJh_z.js";import"./Backdrop-DUF8g36-.js";import"./Button-CVwDhsqF.js";import"./useObservable-BTlRHWB4.js";import"./useIsomorphicLayoutEffect-BYNl4sdH.js";import"./ExpandMore-j96Z6uWc.js";import"./AccordionDetails-D8gh-z9a.js";import"./index-DnL3XN75.js";import"./Collapse-vSwdBrKa.js";import"./useAsync-DruiAlTJ.js";import"./useMountedState-ByMBzLYV.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BGq9ULfl.js";import"./ErrorBoundary-DDmUM-RT.js";import"./ErrorPanel-Bnda3tGm.js";import"./WarningPanel-Ct6Y8Ijr.js";import"./MarkdownContent-CGXvyksG.js";import"./CodeSnippet-Kn9vBnai.js";import"./Box-DE6c26DR.js";import"./styled-BjXftXcZ.js";import"./CopyTextButton-CQwOrqNE.js";import"./useCopyToClipboard-B79QevPK.js";import"./Tooltip-DOW7o-0E.js";import"./Popper-BpKCcSKx.js";import"./List-CwkTxoFK.js";import"./ListContext-BfMtnPb8.js";import"./ListItem-CcSyfWmu.js";import"./ListItemText-BayZFfOR.js";import"./LinkButton-CSuChLvM.js";import"./Link-C2fIupIe.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-kma2G_Yg.js";import"./Divider-DLQMODSR.js";import"./CardActions-BO1Jtm9a.js";import"./BottomLink-BnuP6Yck.js";import"./ArrowForward-C05mkkQp.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
