import{j as t,V as d,a2 as u,a1 as h}from"./iframe-V0mCSmm6.js";import{r as g}from"./plugin-BRFzaHNQ.js";import{S as m,u as n,a as x}from"./useSearchModal-CRfrLkk0.js";import{B as c}from"./Button-eipEU8xc.js";import{D as S,a as f,b as M}from"./DialogTitle-BFLRd8__.js";import{B as j}from"./Box-BQ6A2zHk.js";import{S as r}from"./Grid-B05O9SBT.js";import{S as C}from"./SearchType-DrHIR3Eb.js";import{L as y}from"./List-DoUtMqL3.js";import{H as I}from"./DefaultResultListItem-Bg_1Ud00.js";import{w as R}from"./appWrappers-ydvT4hD9.js";import{m as B}from"./makeStyles-C-ZAQBJP.js";import{s as D,M as k}from"./api-DkbhmyCo.js";import{S as v}from"./SearchContext-DJrQtk6p.js";import{SearchBar as T}from"./SearchBar-CXp3vaD6.js";import{S as b}from"./SearchResult-BBVMYiY8.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CT0NTjK3.js";import"./Plugin-B9VenLT5.js";import"./componentData-Dw75x8hF.js";import"./useAnalytics-DfdyZRyp.js";import"./useApp-BhakDC8j.js";import"./useRouteRef-DW6ibuu0.js";import"./ArrowForward-9xMh-p1h.js";import"./translation-o8q_4f_G.js";import"./Page-DzJuhmOO.js";import"./useMediaQuery-D33NzmGQ.js";import"./Divider-CiNTCJQO.js";import"./ArrowBackIos-DsDE0qT0.js";import"./ArrowForwardIos-zkxyyPGH.js";import"./translation-ztVbYstm.js";import"./Modal-BnW_oUOG.js";import"./Portal-CVJVAyEW.js";import"./Backdrop-ZJVmisKy.js";import"./styled-jbaTKMHC.js";import"./ExpandMore-CbnyxO-3.js";import"./useAsync-DVSYYuK0.js";import"./useMountedState-C0Jd0rHY.js";import"./AccordionDetails-I2vjSAo4.js";import"./index-B9sM2jn7.js";import"./Collapse-B0zJCXOI.js";import"./ListItem-UEfIFqBO.js";import"./ListContext-B-_4E_oo.js";import"./ListItemIcon-D9SwA85G.js";import"./ListItemText-DAqxhx2l.js";import"./Tabs-DYkxhBa5.js";import"./KeyboardArrowRight-DhfySz1T.js";import"./FormLabel-C8yfYkzR.js";import"./formControlState-BmtXmnvT.js";import"./InputLabel-C-81Fc1L.js";import"./Select-DG-bZp9u.js";import"./Popover-D6I6p0LS.js";import"./MenuItem-CQw_qvLE.js";import"./Checkbox-CiO-cp7k.js";import"./SwitchBase-BtY4ud-L.js";import"./Chip-BCbGhA2a.js";import"./Link-C8jjCA1D.js";import"./index-BftmwaLS.js";import"./lodash-DiH-Fmp9.js";import"./WebStorage-CkDvSLB8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-GEOeEmbu.js";import"./useIsomorphicLayoutEffect-7ayzRy9d.js";import"./BUIProvider-D-6HxlFM.js";import"./openLink-C69Yx9MB.js";import"./Search-DcsTcFBe.js";import"./useDebounce-DKAHSvjd.js";import"./InputAdornment-BoQVJ9q1.js";import"./TextField-0MPmI457.js";import"./useElementFilter-DTFKW1gd.js";import"./EmptyState-CFgQ6t3B.js";import"./Progress-ar9qm9er.js";import"./LinearProgress-RZLNKwN8.js";import"./ResponseErrorPanel-BrG44iWY.js";import"./ErrorPanel-DKqsc9IJ.js";import"./WarningPanel-Ccz4x3xp.js";import"./MarkdownContent-BpLNTF6C.js";import"./CodeSnippet-DND1j3mO.js";import"./CopyTextButton-DU42pp83.js";import"./useCopyToClipboard-C2Z7cgqI.js";import"./Tooltip-DNCzzYek.js";import"./Popper-BF5YkCw8.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
