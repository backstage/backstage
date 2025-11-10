import{j as o}from"./iframe-cIBAsfTm.js";import{c as e}from"./plugin-Cb3_xcRa.js";import{S as l}from"./Grid-Dgo5ACik.js";import{C as m}from"./ComponentAccordion-CkBbSrAS.js";import{w as a}from"./appWrappers-C9lQTpTI.js";import{T as i}from"./TemplateBackstageLogoIcon-CgUp6OUQ.js";import{I as s}from"./InfoCard-BL8MQepQ.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CWbQlcVn.js";import"./componentData-DBqEb6G1.js";import"./useAnalytics-Cn11G-Da.js";import"./useApp-BnMckP-G.js";import"./useRouteRef-tsZqa-xk.js";import"./index-BkxQC8j2.js";import"./DialogTitle-DpcONI-S.js";import"./Modal-BGf4XJgV.js";import"./Portal-C3RNSs6Y.js";import"./Backdrop-BVSi2zmG.js";import"./Button-D8Pwv3bO.js";import"./useObservable-5q0VJedC.js";import"./useIsomorphicLayoutEffect-nJ3cOO7G.js";import"./ExpandMore-Fefrqwki.js";import"./AccordionDetails-DeQbQa7K.js";import"./index-DnL3XN75.js";import"./Collapse-BkfRpfT3.js";import"./useAsync-DPpw4t_L.js";import"./useMountedState-DDQ1veKw.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BgcXPZYc.js";import"./ErrorBoundary-CqfBeslE.js";import"./ErrorPanel-BVO-icJS.js";import"./WarningPanel-DCLMi1dI.js";import"./MarkdownContent-CaLyrJfC.js";import"./CodeSnippet-kFMDpIw3.js";import"./Box-5_AhqNAq.js";import"./styled-6iTZXECK.js";import"./CopyTextButton-Dc9zjtfe.js";import"./useCopyToClipboard-B_-Fejqp.js";import"./Tooltip-BlfO5nii.js";import"./Popper-BYAfl6Ks.js";import"./List-BJcgiIVB.js";import"./ListContext-CvDEkeuW.js";import"./ListItem-DDKzfBu6.js";import"./ListItemText-CP0ZRpAu.js";import"./LinkButton-Di3tjDC2.js";import"./Link-BTtSeEzC.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DpWbaMe6.js";import"./Divider-Cpot2Ubt.js";import"./CardActions-C3tcN7S7.js";import"./BottomLink-U2EHDAiC.js";import"./ArrowForward-Hao0JHUH.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
