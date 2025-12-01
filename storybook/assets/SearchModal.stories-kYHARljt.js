import{j as t,m as d,I as u,b as h,T as g}from"./iframe-B07WZXM3.js";import{r as x}from"./plugin-bQkFmPGq.js";import{S as m,u as n,a as S}from"./useSearchModal-BkVyuCIT.js";import{B as c}from"./Button-CyuaBLDC.js";import{a as f,b as M,c as j}from"./DialogTitle-D75WnviF.js";import{B as C}from"./Box-BLhfQJZZ.js";import{S as r}from"./Grid-BY5Lob_Q.js";import{S as y}from"./SearchType-Dn6iNzZQ.js";import{L as I}from"./List-NEqxYc-i.js";import{H as R}from"./DefaultResultListItem-BLYwPsl1.js";import{s as B,M as D}from"./api-B64UmXKD.js";import{S as T}from"./SearchContext-DX1UMHve.js";import{w as k}from"./appWrappers-CY9OeE-D.js";import{SearchBar as v}from"./SearchBar-Cf4MDiiQ.js";import{a as b}from"./SearchResult-Bcx7HD9m.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D2gGq-iW.js";import"./Plugin-CZOVJjYF.js";import"./componentData-DQzB6vVe.js";import"./useAnalytics-CVMEzOss.js";import"./useApp-K3As38vi.js";import"./useRouteRef-YqSqr-8_.js";import"./index-BxkUEN8z.js";import"./ArrowForward-C1CbMcYH.js";import"./translation-B0JsGe5A.js";import"./Page-CoVW7z3p.js";import"./useMediaQuery-CgXNwOmD.js";import"./Divider-MyjmiSrT.js";import"./ArrowBackIos-Ag6TSUng.js";import"./ArrowForwardIos-CcHL3Iay.js";import"./translation-Cx8mRY3H.js";import"./Modal-C4lsEVR2.js";import"./Portal-XA5rRvQB.js";import"./Backdrop-BhjMJ7cT.js";import"./styled-DWF50Q3F.js";import"./ExpandMore-Da5XW09b.js";import"./useAsync-DCstABRD.js";import"./useMountedState-BHHklG7n.js";import"./AccordionDetails-B-vBZmTY.js";import"./index-DnL3XN75.js";import"./Collapse-Bc-VFX1u.js";import"./ListItem-CbK_QR24.js";import"./ListContext-DoxtYS94.js";import"./ListItemIcon-CsMLWt_q.js";import"./ListItemText-BnYxYQrd.js";import"./Tabs-DwFGmq2-.js";import"./KeyboardArrowRight-DaCDDV_w.js";import"./FormLabel-BaWB6GXZ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-D_ymLlMo.js";import"./InputLabel-CWKzW2YU.js";import"./Select-BdNrLbz5.js";import"./Popover-BvP6HXT7.js";import"./MenuItem-CkSkG-Fe.js";import"./Checkbox-DxMSedF6.js";import"./SwitchBase-CK2b8vb-.js";import"./Chip-C4ZX6fhU.js";import"./Link-BSdi_-Cv.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BmNeYwoO.js";import"./useIsomorphicLayoutEffect-BK_xBPGN.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-DR-IYMq-.js";import"./useDebounce-CkZwm8dm.js";import"./InputAdornment-Cq_1uAXC.js";import"./TextField-5kDh-taJ.js";import"./useElementFilter-Dc8BtzOg.js";import"./EmptyState-BagL5cg5.js";import"./Progress-zWsf7NZE.js";import"./LinearProgress-CFE57kjP.js";import"./ResponseErrorPanel-D6T6K6Gd.js";import"./ErrorPanel-ayETAGhj.js";import"./WarningPanel-DImNnyuV.js";import"./MarkdownContent-CcNYv7l1.js";import"./CodeSnippet-BxcFip7J.js";import"./CopyTextButton-xE5t_wDk.js";import"./useCopyToClipboard-2MhLRliJ.js";import"./Tooltip-CZw4hPcl.js";import"./Popper-DRLEgsx8.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
