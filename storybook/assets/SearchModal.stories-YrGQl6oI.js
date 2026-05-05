import{j as t,W as d,a3 as u,a2 as h}from"./iframe-DWvOg1Nr.js";import{r as g}from"./plugin-n4xMQXR9.js";import{S as l,u as n,a as x}from"./useSearchModal-MKqBgLeY.js";import{B as c}from"./Button-BbevIr3Z.js";import{D as S,a as f,b as M}from"./DialogTitle-BRBrxW41.js";import{B as j}from"./Box-zyqdCy3P.js";import{S as r}from"./Grid-Xzlg2O4n.js";import{S as C}from"./SearchType-BvtDSLOd.js";import{L as y}from"./List-BFA7b6ty.js";import{H as I}from"./DefaultResultListItem-DIdH9Q-L.js";import{w as R}from"./appWrappers-qsIe7tVM.js";import{m as B}from"./makeStyles-CHGG-m_x.js";import{s as D,M as k}from"./api-C_OdQe4o.js";import{S as v}from"./SearchContext-BltdEP87.js";import{SearchBar as T}from"./SearchBar-BPGjeCBD.js";import{S as b}from"./SearchResult-BxfxCnVg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dxgn-S4P.js";import"./Plugin-DAgqnd1A.js";import"./componentData-DqnKbKJN.js";import"./useAnalytics-CLrtpPO4.js";import"./useApp-QYowGE2r.js";import"./useRouteRef-DCvRouNi.js";import"./ArrowForward-DUaLA1W5.js";import"./translation-Bo3vZ6kI.js";import"./Page-NIBM9V6w.js";import"./useMediaQuery-B0h4mn6N.js";import"./Divider-l_Tw4Y2t.js";import"./ArrowBackIos-BrfFutwH.js";import"./ArrowForwardIos-DTl0ZSWg.js";import"./translation-DYZj4umQ.js";import"./Modal-DET7dYk7.js";import"./Portal-y55DOJ_z.js";import"./Backdrop-BS0KDwxE.js";import"./styled-RIBlsQy0.js";import"./ExpandMore-DPLbvTgi.js";import"./useAsync-WwgC0jUx.js";import"./useMountedState--89EdGyj.js";import"./AccordionDetails-IDw-tlej.js";import"./index-B9sM2jn7.js";import"./Collapse-DYLsDfAh.js";import"./ListItem-CYRCHcIm.js";import"./ListContext-BV1W3iGS.js";import"./ListItemIcon-ClLCrJv6.js";import"./ListItemText-B4brgRyM.js";import"./Tabs-BH8YMBca.js";import"./KeyboardArrowRight-B_RZry8g.js";import"./FormLabel-NmTkFu44.js";import"./formControlState-DVeKIedv.js";import"./InputLabel-CZqMVil_.js";import"./Select-czkWpdW5.js";import"./Popover-BRA9BNP2.js";import"./MenuItem-Chca2jLO.js";import"./Checkbox-B_TtUlRL.js";import"./SwitchBase-DDXj0dNO.js";import"./Chip-CS5kTr-p.js";import"./Link-C6IojI8B.js";import"./index-BUDLY78-.js";import"./lodash-BszOACSM.js";import"./WebStorage-DIHlPgXc.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Dg71hkMM.js";import"./useIsomorphicLayoutEffect-CVgPRDzJ.js";import"./BUIProvider-B0EmIMVv.js";import"./openLink-l0pO1O-P.js";import"./useResolvedHref-BKS5TyZb.js";import"./Search-CbKZVXZO.js";import"./useDebounce-BW491bG8.js";import"./InputAdornment-CElJFBHP.js";import"./TextField-B3OTj9W8.js";import"./useElementFilter-9TwOTyqe.js";import"./EmptyState-YST4_Rg-.js";import"./Progress-CMIx7q7X.js";import"./LinearProgress-BZB84Pux.js";import"./ResponseErrorPanel-BDqeevV-.js";import"./ErrorPanel-D3vNh4S-.js";import"./WarningPanel-BZtrrDpu.js";import"./MarkdownContent--ubLUnxB.js";import"./CodeSnippet-ezk9Eue2.js";import"./CopyTextButton-DimktF9n.js";import"./useCopyToClipboard-CxVcS6P-.js";import"./Tooltip-DwFxLD2U.js";import"./Popper-Dvaylqi7.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
