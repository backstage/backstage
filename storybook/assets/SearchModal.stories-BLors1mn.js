import{j as t,m as d,I as u,b as h,T as g}from"./iframe-C8uhRVJE.js";import{r as x}from"./plugin-COL5dFwn.js";import{S as m,u as n,a as S}from"./useSearchModal-Db3AnfzC.js";import{B as c}from"./Button-BSbGK_Ct.js";import{a as f,b as M,c as j}from"./DialogTitle-gHgKDmm6.js";import{B as C}from"./Box-CqSl_hUY.js";import{S as r}from"./Grid-C5ZyGaTv.js";import{S as y}from"./SearchType-CF_xaALK.js";import{L as I}from"./List-DvPRKsUn.js";import{H as R}from"./DefaultResultListItem-rdIVoH_a.js";import{s as B,M as D}from"./api-nXSRwllt.js";import{S as T}from"./SearchContext-Cuk_qmRx.js";import{w as k}from"./appWrappers-BWLcUcVY.js";import{SearchBar as v}from"./SearchBar-DhSS0wQf.js";import{a as b}from"./SearchResult-DCD9Hqbf.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BaqoCGjU.js";import"./Plugin-_vQLgw_y.js";import"./componentData-COYXa6k6.js";import"./useAnalytics-CMB7EDSs.js";import"./useApp-IzIBR1Vv.js";import"./useRouteRef-B0Vi5G0u.js";import"./index-BYn64cw2.js";import"./ArrowForward-DNYazqhw.js";import"./translation-B3dhk17w.js";import"./Page-CUVzxIzP.js";import"./useMediaQuery-CVETFPFB.js";import"./Divider-BSVlJEqX.js";import"./ArrowBackIos-DdUmuhtW.js";import"./ArrowForwardIos-DVG7nOg2.js";import"./translation-e6vKEut7.js";import"./Modal-BCg34ymo.js";import"./Portal-DGxbDxZD.js";import"./Backdrop-BYegWcH-.js";import"./styled-CsbE0ba0.js";import"./ExpandMore-hZ2c00bV.js";import"./useAsync-CISCSNua.js";import"./useMountedState-D0BWMouD.js";import"./AccordionDetails-CeLa6pif.js";import"./index-B9sM2jn7.js";import"./Collapse-DlLfqGWf.js";import"./ListItem-CMqPdlpf.js";import"./ListContext-CLNvlY7i.js";import"./ListItemIcon-J7mH5V5X.js";import"./ListItemText-u8pHhn01.js";import"./Tabs-CmylVRRi.js";import"./KeyboardArrowRight-CCOL6nfW.js";import"./FormLabel-DrjYVuAl.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-yOLsMAyU.js";import"./InputLabel-CwFtWVGx.js";import"./Select-DoMjfmP2.js";import"./Popover-BGm3xZF3.js";import"./MenuItem-BcfjPQef.js";import"./Checkbox-JCSP6cGB.js";import"./SwitchBase-B7TJrYZZ.js";import"./Chip-BSGzT2Mn.js";import"./Link-BbMg_ACg.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-BasahIcU.js";import"./useIsomorphicLayoutEffect-B6F3ekP_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-B3spVZlu.js";import"./useDebounce-DhUB5OX-.js";import"./InputAdornment-BJ_NIK8n.js";import"./TextField-2z55-Wcu.js";import"./useElementFilter-Bvvno2oS.js";import"./EmptyState-CPDJ9qh2.js";import"./Progress-BMwYAuxR.js";import"./LinearProgress-DQ7Xqpgk.js";import"./ResponseErrorPanel-RYXjbKJy.js";import"./ErrorPanel-ByR9HTcg.js";import"./WarningPanel-DEmZ2skU.js";import"./MarkdownContent-BWUzH6fM.js";import"./CodeSnippet-BrHkgkym.js";import"./CopyTextButton-DUWRsVAM.js";import"./useCopyToClipboard-Btd4dIqz.js";import"./Tooltip-Dm66oIkk.js";import"./Popper-DTopPJJ5.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
