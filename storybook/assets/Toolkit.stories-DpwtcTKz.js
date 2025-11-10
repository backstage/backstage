import{j as o}from"./iframe-Dg7jNfgV.js";import{c as e}from"./plugin-BpfyQ0vQ.js";import{S as l}from"./Grid-DZoxUphm.js";import{C as m}from"./ComponentAccordion-DvreVE0q.js";import{w as a}from"./appWrappers-Dhyq66xu.js";import{T as i}from"./TemplateBackstageLogoIcon-CtgPm3Gi.js";import{I as s}from"./InfoCard-YTF1zP1R.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-G9-uH3UY.js";import"./componentData-CzpKGprp.js";import"./useAnalytics-DDAI3Sby.js";import"./useApp-DBejBM5d.js";import"./useRouteRef-BE4yvNyY.js";import"./index-DJhhhiwK.js";import"./DialogTitle-BGuqEob6.js";import"./Modal-CaeBjbT7.js";import"./Portal-DaCRxhVb.js";import"./Backdrop-INLhdtBn.js";import"./Button-CrARaf08.js";import"./useObservable-BZnIpjCU.js";import"./useIsomorphicLayoutEffect-BlM3Hzgi.js";import"./ExpandMore-B7ltQ0WG.js";import"./AccordionDetails-CFRyv9zh.js";import"./index-DnL3XN75.js";import"./Collapse-BXYqoVfQ.js";import"./useAsync-DkNvCakU.js";import"./useMountedState-6AheAbGL.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-YBBmqTdA.js";import"./ErrorBoundary-DF2UJt6Z.js";import"./ErrorPanel-CFu8Rfin.js";import"./WarningPanel-D2enhZvg.js";import"./MarkdownContent-XjtKEh5y.js";import"./CodeSnippet-DJ-lPCL_.js";import"./Box-Bmqbh7u4.js";import"./styled-CMe42Sps.js";import"./CopyTextButton-CNGlDDM9.js";import"./useCopyToClipboard-CoeOzktD.js";import"./Tooltip-hjut9A6-.js";import"./Popper-DfjHoTPM.js";import"./List-CB5Cl-bM.js";import"./ListContext-DjmviigF.js";import"./ListItem-WexTgdCu.js";import"./ListItemText-DJB03TAT.js";import"./LinkButton-CpCeZYF_.js";import"./Link-gNdToM-H.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-W6MdNAvW.js";import"./Divider-ithO4Mrh.js";import"./CardActions-CH0H7gTz.js";import"./BottomLink-DgZkINS1.js";import"./ArrowForward-B5pYWWYy.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
