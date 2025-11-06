import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DKl1TaBY.js";import{r as x}from"./plugin-CNz7lisr.js";import{S as m,u as n,a as S}from"./useSearchModal-BHhqYFuA.js";import{B as c}from"./Button-ho9zTU_x.js";import{a as f,b as M,c as j}from"./DialogTitle-BfB3GFxp.js";import{B as C}from"./Box-8sIy39Mn.js";import{S as r}from"./Grid-DucnE1Qv.js";import{S as y}from"./SearchType-DkJm6xb1.js";import{L as I}from"./List-BKhl6P7T.js";import{H as R}from"./DefaultResultListItem-BiNrLF4X.js";import{s as B,M as D}from"./api-CzWMH9sB.js";import{S as T}from"./SearchContext-Dh6i_bMc.js";import{w as k}from"./appWrappers-CQMFW9f8.js";import{SearchBar as v}from"./SearchBar-BYzzKaRj.js";import{a as b}from"./SearchResult-CtVO_FE4.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D3KAHFPL.js";import"./Plugin-Cp-tNdu1.js";import"./componentData-C9VKpHEQ.js";import"./useAnalytics-CECp0-UO.js";import"./useApp-OM9z5S5N.js";import"./useRouteRef-CjGG19qw.js";import"./index-CAizWZSO.js";import"./ArrowForward-DvHRQMuG.js";import"./translation-haz9RaEa.js";import"./Page-B1CZycKH.js";import"./useMediaQuery-D7zlXt0H.js";import"./Divider-DdBr9tFd.js";import"./ArrowBackIos-DA3-8B4R.js";import"./ArrowForwardIos-BjGHvM1p.js";import"./translation-BjTkd2s2.js";import"./Modal-Dg-OYacR.js";import"./Portal-t3ECfreD.js";import"./Backdrop-C6FYe0Ep.js";import"./styled-DuPROqdG.js";import"./ExpandMore-SNT8Gr9W.js";import"./useAsync-6VrnLR2E.js";import"./useMountedState-Bg5ZLpHR.js";import"./AccordionDetails-5IM8yJG8.js";import"./index-DnL3XN75.js";import"./Collapse-DRCUh2Je.js";import"./ListItem-Cik-ImzB.js";import"./ListContext-Df16DwNz.js";import"./ListItemIcon-ClgSqD8f.js";import"./ListItemText-X8gsxozg.js";import"./Tabs-yrte2RZ5.js";import"./KeyboardArrowRight-C3Rjqlpm.js";import"./FormLabel-BnQER_VI.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-ivci966F.js";import"./InputLabel-BD4uJDC-.js";import"./Select-DQrTgl6q.js";import"./Popover-CYX2rhOY.js";import"./MenuItem-DFRTJYZD.js";import"./Checkbox-bPCgQ04X.js";import"./SwitchBase-Dt7-H3SR.js";import"./Chip-Bg0W3qFH.js";import"./Link-BtYWFjac.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-DEWsWzFy.js";import"./useIsomorphicLayoutEffect-5ZyPzn4u.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-0QwAViZC.js";import"./useDebounce-DhKLCFoK.js";import"./InputAdornment-D5BkAeq5.js";import"./TextField-DAe5e78r.js";import"./useElementFilter-DQT3JP6-.js";import"./EmptyState-D9A0lkz8.js";import"./Progress-BVLc_jom.js";import"./LinearProgress-DyuOcEX6.js";import"./ResponseErrorPanel-uJYms0KM.js";import"./ErrorPanel-9AkQroOm.js";import"./WarningPanel-eVG4_neK.js";import"./MarkdownContent-Cd_tUbb9.js";import"./CodeSnippet-CNnnJvIp.js";import"./CopyTextButton-TfPCFLIm.js";import"./useCopyToClipboard-BgwPpn9s.js";import"./Tooltip-73fNlhkg.js";import"./Popper-BCEz05NO.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
