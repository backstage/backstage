import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-QksS9oll.js";import{s as g,H as u}from"./plugin-DaBVnQ4M.js";import{c as h}from"./api-2kzlNHsI.js";import{c as f}from"./catalogApiMock-BFbk-t-D.js";import{s as x}from"./api-CD1TnuNJ.js";import{S as y}from"./SearchContext-C-7jjasf.js";import{P as S}from"./Page-BU4DG1As.js";import{S as r}from"./Grid-D7XFfWKi.js";import{b as k,a as j,c as C}from"./plugin-cime2aoh.js";import{T as P}from"./TemplateBackstageLogo-Dq9p3Gpo.js";import{T}from"./TemplateBackstageLogoIcon-B4Sq2VtL.js";import{e as I}from"./routes-CEBAglxo.js";import{w as v}from"./appWrappers-Cbugcrv7.js";import{s as G}from"./StarredEntitiesApi-DrtcVWcH.js";import{M as A}from"./MockStarredEntitiesApi-DAqYTPXZ.js";import{I as B}from"./InfoCard-BwrMRdCa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BRpTdJ9c.js";import"./Plugin-TdwU8h6j.js";import"./componentData-CRWc3Ue1.js";import"./useAnalytics-D3S6fnIb.js";import"./useApp-CB9Zi9mM.js";import"./useRouteRef-CZboVwVy.js";import"./index-esiVI4gD.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-DdMXChPX.js";import"./useMountedState-DqrcsGZ8.js";import"./DialogTitle-CMD6ovcq.js";import"./Modal-BVik2DkJ.js";import"./Portal-DNcXKhCz.js";import"./Backdrop-D-shBcLD.js";import"./Button-Dfimf7ZU.js";import"./useObservable-BEkg0zh2.js";import"./useIsomorphicLayoutEffect-DsxO7SBP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-B-_Sxb8f.js";import"./ErrorBoundary-DXuXgUlr.js";import"./ErrorPanel-_1DH6jIy.js";import"./WarningPanel-D9lI_etd.js";import"./ExpandMore-BvW0rUjO.js";import"./AccordionDetails-DsDHdK5k.js";import"./index-B9sM2jn7.js";import"./Collapse-BhNoWWNo.js";import"./MarkdownContent-D_MwY5Q0.js";import"./CodeSnippet-NS8GLkfk.js";import"./Box-4mwxRbT8.js";import"./styled-Dz3wLS-L.js";import"./CopyTextButton-CkYKd75j.js";import"./useCopyToClipboard-B1WVdUm6.js";import"./Tooltip-DBYgA5-n.js";import"./Popper-BcJim0Sm.js";import"./List-BifWF3Ny.js";import"./ListContext-BPnrPY1o.js";import"./ListItem-CjzOJyc8.js";import"./ListItemText-DdfK1hjm.js";import"./LinkButton-DzZbKr17.js";import"./Link-vv3H9C9T.js";import"./CardHeader-B0eVnrW4.js";import"./Divider-C2MLF46q.js";import"./CardActions-DAsWgPAr.js";import"./BottomLink-8s-33zJ-.js";import"./ArrowForward-DFKd6RHK.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
